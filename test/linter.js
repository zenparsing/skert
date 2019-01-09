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

exports.validate = function validate(rootPath, { scopeTree, lineMap, location }) {
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
      throw new Error(`Undeclared variable '${ free.value }' ${ where(free) }`);
    }
  }

  rootPath.visit(new class LintVisitor {

    Identifier(path) {
      if (!unused.has(path.node)) {
        return;
      }

      for (let p = path.parent; p; p = p.parent) {
        switch (p.node.type) {
          case 'ExportDeclaration':
            return;
          case 'FunctionDeclaration':
          case 'FunctionExpression':
          case 'ArrowFunction':
            if (
              p.node.params.length == 0 ||
              p.node.params[p.node.params.length - 1] !== path.node
            ) {
              return;
            }
            break;
          case 'FunctionBody':
          case 'Module':
          case 'Script':
            break;
        }
      }

      throw new Error(`Unused declaration '${ path.node.value }' ${ where(path.node) }`);
    }

  });
}
