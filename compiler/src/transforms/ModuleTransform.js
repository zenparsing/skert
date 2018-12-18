import { resolveScopes } from '../Parser.js';

export function register({ define, templates, AST }) {
  define(rootPath => new ImportExportProcessor().execute(rootPath));

  class ImportExportProcessor {

    constructor() {
      @rootPath = null;
      @moduleNames = new Map();
      @reexports = [];
      @exports = [];
      @imports = [];
      @replacements = null;
      @index = 0;
      @topImport = null;
    }

    execute(rootPath) {
      @rootPath = rootPath;
      @visit(rootPath.node);
    }

    @visit(node) {
      if (node && this[node.type]) {
        this[node.type](node);
      }
    }

    @replaceWith(newNode) {
      @replacements[@index] = newNode;
    }

    Module(node) {
      let moduleScope = resolveScopes(node).children[0];
      let replaceMap = new Map();

      @replacements = Array.from(node.statements);

      for (let i = 0; i < node.statements.length; ++i) {
        @index = i;
        @visit(node.statements[i]);
      }

      let statements = [
        new AST.Directive(
          'use strict',
          new AST.StringLiteral('use strict')
        )
      ];

      for (let { local, exported, hoist } of @exports) {
        if (hoist) {
          statements.push(templates.statement`
            exports.${ exported } = ${ local }
          `);
        }
      }

      for (let { names, from, exporting } of @imports) {
        if (exporting && names.length === 1) {
          let { imported, local } = names[0];
          if (imported) {
            statements.push(templates.statement`
              exports.${ local } = require(${ from }).${ imported }
            `);
          } else if (local) {
            statements.push(templates.statement`
              exports.${ local } = require(${ from })
            `);
          } else {
            statements.push(templates.statement`
              Object.assign(exports, require(${ from }))
            `);
          }
          continue;
        }

        let moduleName = @moduleNames.get(from.value);
        if (!moduleName) {
          moduleName = @rootPath.uniqueIdentifier('_' + from.value
            .replace(/.*[/\\](?=[^/\\]+$)/, '')
            .replace(/\..*$/, '')
            .replace(/[^a-zA-Z0-1_$]/g, '_')
          );

          @moduleNames.set(from.value, moduleName);

          statements.push(templates.statement`
            let ${ moduleName } = require(${ from })
          `);
        }

        for (let { imported, local } of names) {
          let statement = null;

          if (exporting) {

            if (imported) {
              statement = templates.statement`
                exports.${ local } = ${ moduleName }.${ imported }
              `;
            } else if (local) {
              statement = templates.statement`
                exports.${ local } = ${ moduleName }
              `;
            } else {
              statement = templates.statement`
                Object.assign(exports, ${ moduleName })
              `;
            }

          } else {

            if (imported) {
              if (imported === 'default') {
                statement = templates.statement`
                  if (typeof ${ moduleName } === 'function') {
                    ${ moduleName } = { default: ${ moduleName } };
                  }
                `;
              }

              for (let ref of moduleScope.names.get(local).references) {
                replaceMap.set(ref, new AST.MemberExpression(
                  new AST.Identifier(moduleName),
                  new AST.Identifier(imported)
                ));
              }

            } else {
              statement = templates.statement`
                const ${ local } = ${ moduleName }
              `;
            }

          }

          if (statement) {
            statements.push(statement);
          }
        }
      }

      for (let node of @replacements) {
        if (Array.isArray(node)) {
          node.forEach(n => statements.push(n));
        } else if (node) {
          statements.push(node);
        }
      }

      node.statements = statements;

      @rootPath.visit({
        Identifier(path) {
          let expr = replaceMap.get(path.node);
          if (!expr) {
            return;
          }

          let { parentNode } = path;

          switch (parentNode.type) {
            case 'PatternProperty':
              if (parentNode.name === path.node && !parentNode.pattern) {
                parentNode.pattern = expr;
              }
              break;
            case 'PropertyDefinition':
              if (!parentNode.expression) {
                parentNode.expression = expr;
              }
              break;
            case 'CallExpression':
              path.replaceNode(templates.expression`
                (0, ${ expr })
              `);
              break;
            default:
              path.replaceNode(expr);
              break;
          }
        },

        ImportCall(path) {
          path.replaceNode(templates.expression`
            Promise.resolve(require(${ path.node.argument }))
          `);
        },
      });
    }

    ImportDeclaration(node) {
      @imports.push(@topImport = {
        names: [],
        from: node.from,
        exporting: false,
      });
      @visit(node.imports);
      @replaceWith(null);
    }

    NamedImports(node) {
      for (let child of node.specifiers) {
        @visit(child);
      }
    }

    ImportSpecifier(node) {
      @topImport.names.push({
        imported: node.imported.value,
        local: node.local ? node.local.value : node.imported.value,
      });
    }

    DefaultImport(node) {
      @topImport.names.push({
        imported: 'default',
        local: node.identifier.value,
      });
      @visit(node.imports);
    }

    NamespaceImport(node) {
      @topImport.names.push({
        imported: null,
        local: node.identifier.value,
      });
    }

    @getPatternDeclarations(node, list) {
      switch (node.type) {
        case 'VariableDeclaration':
          node.declarations.forEach(c =>
            @getPatternDeclarations(c, list)
          );
          break;
        case 'VariableDeclarator':
          @getPatternDeclarations(node.pattern, list);
          break;
        case 'Identifier':
          list.push(node);
          break;
        case 'ObjectPattern':
          node.properties.forEach(p =>
            @getPatternDeclarations(p.pattern || p.name, list)
          );
          break;
        case 'ArrayPattern':
          node.elements.forEach(p =>
            @getPatternDeclarations(p.pattern, list)
          );
          break;
      }
    }

    ExportDeclaration(node) {
      let { declaration } = node;

      if (declaration.type === 'VariableDeclaration') {
        let statements = [declaration];
        let bindings = [];

        @getPatternDeclarations(declaration, bindings);

        for (let ident of bindings) {
          @exports.push({
            local: ident.value,
            exported: ident.value,
            hoist: false,
          });
          statements.push(templates.statement`
            exports.${ ident.value } = ${ ident.value }
          `);
        }

        @replaceWith(statements);

      } else {

        let ident = declaration.identifier;
        let exportName = {
          local: ident.value,
          exported: ident.value,
          hoist: false,
        };

        if (declaration.type === 'FunctionDeclaration') {
          exportName.hoist = true;
          @replaceWith(declaration);
        } else {
          @replaceWith([
            declaration,
            templates.statement`
              exports.${ ident.value } = ${ ident.value }
            `,
          ]);
        }

        @exports.push(exportName);
      }
    }

    ExportNameList(node) {
      if (node.from) {
        let reexport = {
          names: [],
          from: node.from,
          exporting: true,
        };

        for (let child of node.specifiers) {
          reexport.names.push({
            imported: child.local.value,
            local: child.exported ? child.exported.value : child.local.value,
          });
        }

        @imports.push(reexport);
        @replaceWith(null);

      } else {

        let statements = [];

        for (let child of node.specifiers) {
          let name = {
            local: child.local.value,
            exported: child.exported ? child.exported.value : child.local.value,
            hoist: false,
          };

          @exports.push(name);

          statements.push(templates.statement`
            exports.${ name.exported } = ${ child.local }
          `);
        }

        @replaceWith(statements);
      }
    }

    ExportDefault(node) {
      let { binding } = node;

      if (
        binding.type === 'FunctionDeclaration' ||
        binding.type === 'ClassDeclaration'
      ) {
        if (!binding.identifier) {
          binding.identifier = new AST.Identifier(
            @rootPath.uniqueIdentifier('_default')
          );
        }

        let exportName = {
          local: binding.identifier.value,
          exported: 'default',
          hoist: false,
        };

        if (binding.type === 'FunctionDeclaration') {
          exportName.hoist = true;
          @replaceWith(binding);
        } else {
          @replaceWith([
            binding,
            templates.statement`
              exports.default = ${ binding.identifier.value }
            `,
          ]);
        }

        @exports.push(exportName);

      } else {

        @exports.push({
          local: null,
          exported: 'default',
          hoist: false,
        });

        @replaceWith(templates.statement`
          exports.default = ${ node.binding };
        `);

      }
    }

    ExportNamespace(node) {
      @imports.push({
        names: [{
          imported: null,
          local: node.identifier ? node.identifier.value : null,
        }],
        from: node.from,
        exporting: true,
      });
      @replaceWith(null);
    }

    ExportDefaultFrom(node) {
      @imports.push({
        names: [{
          imported: 'default',
          local: node.identifier.value,
        }],
        from: node.from,
        exporting: true,
      });
      @replaceWith(null);
    }

  }
}
