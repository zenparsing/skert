import { resolveScopes } from '../Parser.js';

export function registerTransform({ define, templates, AST }) {
  define(rootPath => new ImportExportProcessor().execute(rootPath));

  class ImportExportProcessor {

    constructor() {
      this.rootPath = null;
      this.moduleNames = new Map();
      this.reexports = [];
      this.exports = [];
      this.imports = [];
      this.replacements = null;
      this.index = 0;
      this.topImport = null;
      this.metaName = null;
    }

    execute(rootPath) {
      this.rootPath = rootPath;
      this.visit(rootPath.node);
    }

    visit(node) {
      if (node && this[node.type]) {
        this[node.type](node);
      }
    }

    replaceWith(newNode) {
      this.replacements[this.index] = newNode;
    }

    getPatternDeclarations(node, list) {
      switch (node.type) {
        case 'VariableDeclaration':
          node.declarations.forEach(c =>
            this.getPatternDeclarations(c, list)
          );
          break;
        case 'VariableDeclarator':
          this.getPatternDeclarations(node.pattern, list);
          break;
        case 'Identifier':
          list.push(node);
          break;
        case 'ObjectPattern':
          node.properties.forEach(p =>
            this.getPatternDeclarations(p.pattern || p.name, list)
          );
          break;
        case 'ArrayPattern':
          node.elements.forEach(p =>
            this.getPatternDeclarations(p.pattern, list)
          );
          break;
      }
    }

    Module(node) {
      let moduleScope = resolveScopes(node).children[0];
      let replaceMap = new Map();
      let { rootPath } = this;

      this.replacements = Array.from(node.statements);

      for (let i = 0; i < node.statements.length; ++i) {
        this.index = i;
        this.visit(node.statements[i]);
      }

      let statements = [];

      for (let { local, exported, hoist } of this.exports) {
        if (hoist) {
          statements.push(templates.statement`
            exports.${ exported } = ${ local }
          `);
        }
      }

      for (let { names, from, exporting } of this.imports) {
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

        let moduleName = this.moduleNames.get(from.value);
        if (!moduleName) {
          moduleName = rootPath.uniqueIdentifier('_' + from.value
            .replace(/.*[/\\](?=[^/\\]+$)/, '')
            .replace(/\..*$/, '')
            .replace(/[^a-zA-Z0-1_$]/g, '_')
          );

          this.moduleNames.set(from.value, moduleName);

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

      for (let node of this.replacements) {
        if (Array.isArray(node)) {
          node.forEach(n => statements.push(n));
        } else if (node) {
          statements.push(node);
        }
      }

      node.statements = statements;

      rootPath.visit({
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
          path.visitChildren(this);
          path.replaceNode(templates.expression`
            Promise.resolve(require(${ path.node.argument }))
          `);
        },

        MetaProperty(path) {
          path.visitChildren(this);
          if (path.node.left !== 'import' || path.node.right !== 'meta') {
            return;
          }
          if (!this.metaName) {
            this.metaName = rootPath.uniqueIdentifier('importMeta', {
              kind: 'const',
              initializer: templates.expression`
                ({
                  require,
                  dirname: __dirname,
                  filename: __filename,
                })
              `.expression,
            });
          }
          path.replaceNode(new AST.Identifier(this.metaName));
        },
      });

      rootPath.applyChanges();

      node.statements.unshift(new AST.Directive(
        'use strict',
        new AST.StringLiteral('use strict')
      ));
    }

    ImportDeclaration(node) {
      this.imports.push(this.topImport = {
        names: [],
        from: node.from,
        exporting: false,
      });
      this.visit(node.imports);
      this.replaceWith(null);
    }

    NamedImports(node) {
      for (let child of node.specifiers) {
        this.visit(child);
      }
    }

    ImportSpecifier(node) {
      this.topImport.names.push({
        imported: node.imported.value,
        local: node.local ? node.local.value : node.imported.value,
      });
    }

    DefaultImport(node) {
      this.topImport.names.push({
        imported: 'default',
        local: node.identifier.value,
      });
      this.visit(node.imports);
    }

    NamespaceImport(node) {
      this.topImport.names.push({
        imported: null,
        local: node.identifier.value,
      });
    }

    ExportDeclaration(node) {
      let { declaration } = node;

      if (declaration.type === 'VariableDeclaration') {
        let statements = [declaration];
        let bindings = [];

        this.getPatternDeclarations(declaration, bindings);

        for (let ident of bindings) {
          this.exports.push({
            local: ident.value,
            exported: ident.value,
            hoist: false,
          });
          statements.push(templates.statement`
            exports.${ ident.value } = ${ ident.value }
          `);
        }

        this.replaceWith(statements);

      } else {

        let ident = declaration.identifier;
        let exportName = {
          local: ident.value,
          exported: ident.value,
          hoist: false,
        };

        if (declaration.type === 'FunctionDeclaration') {
          exportName.hoist = true;
          this.replaceWith(declaration);
        } else {
          this.replaceWith([
            declaration,
            templates.statement`
              exports.${ ident.value } = ${ ident.value }
            `,
          ]);
        }

        this.exports.push(exportName);
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

        this.imports.push(reexport);
        this.replaceWith(null);

      } else {

        let statements = [];

        for (let child of node.specifiers) {
          let name = {
            local: child.local.value,
            exported: child.exported ? child.exported.value : child.local.value,
            hoist: false,
          };

          this.exports.push(name);

          statements.push(templates.statement`
            exports.${ name.exported } = ${ child.local }
          `);
        }

        this.replaceWith(statements);
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
            this.rootPath.uniqueIdentifier('_default')
          );
        }

        let exportName = {
          local: binding.identifier.value,
          exported: 'default',
          hoist: false,
        };

        if (binding.type === 'FunctionDeclaration') {
          exportName.hoist = true;
          this.replaceWith(binding);
        } else {
          this.replaceWith([
            binding,
            templates.statement`
              exports.default = ${ binding.identifier.value }
            `,
          ]);
        }

        this.exports.push(exportName);

      } else {

        this.exports.push({
          local: null,
          exported: 'default',
          hoist: false,
        });

        this.replaceWith(templates.statement`
          exports.default = ${ node.binding };
        `);

      }
    }

    ExportNamespace(node) {
      this.imports.push({
        names: [{
          imported: null,
          local: node.identifier ? node.identifier.value : null,
        }],
        from: node.from,
        exporting: true,
      });
      this.replaceWith(null);
    }

    ExportDefaultFrom(node) {
      this.imports.push({
        names: [{
          imported: 'default',
          local: node.identifier.value,
        }],
        from: node.from,
        exporting: true,
      });
      this.replaceWith(null);
    }

  }
}
