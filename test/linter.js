const vm = require('vm');

function getGlobalNames() {
  let context = vm.createContext({});
  return Object.getOwnPropertyNames(vm.runInContext('this', context));
}

const globalNames = new RegExp('^' + getGlobalNames().join('|') + '$');

function isGlobalName(name) {
  switch (name) {
    case 'Buffer':
    case 'global': return true;
    default: return globalNames.test(name);
  }
}

exports.validate = function validate(rootPath, parseResult) {
  let { location, scopeTree, lineMap } = parseResult;

  function where(node) {
    let { line, column } = lineMap.locate(node.start);
    return `(${ location }:${ line + 1 }:${ column + 1 })`;
  }

  let unused = new Set();

  function gatherUnused(scope) {
    scope.children.forEach(gatherUnused);
    for (let [key, value] of scope.names) {
      if (value.references.length === 0) {
        unused.add(value.declarations[0]);
      }
    }
  }

  gatherUnused(scopeTree);

  for (let free of scopeTree.free) {
    if (!isGlobalName(free.value)) {
      throw parseResult.createSyntaxError(
        `Undeclared variable '${ free.value }'`,
        free.start,
        free.end
      );
    }
  }

  rootPath.visit(new class LintVisitor {

    Identifier(path) {
      let { node } = path;

      if (!unused.has(node)) {
        return;
      }

      for (let p = path.parent; p; p = p.parent) {
        switch (p.node.type) {
          // Unused variables can appear in catch clauses or as exported names
          case 'CatchClause':
          case 'ExportDeclaration':
            return;
          // Unused variables can appear as intermediate parameter values
          case 'FormalParameter': {
            let { params } = p.parent.node;
            if (params[params.length - 1] !== p.node) {
              return;
            }
            break;
          }
          case 'FunctionBody':
          case 'Module':
          case 'Script':
          case 'ObjectPattern':
          case 'ArrayPattern':
            break;
        }
      }

      throw parseResult.createSyntaxError(
        `Unused declaration '${ path.node.value }'`,
        node.start,
        node.end
      );
    }

  });
}
