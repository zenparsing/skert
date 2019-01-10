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

function gatherUnusedDeclarations(scopeTree) {
  let unused = new Set();

  function visit(scope) {
    scope.children.forEach(visit);
    for (let [key, value] of scope.names) {
      if (value.references.length === 0) {
        unused.add(value.declarations[0]);
      }
    }
  }

  visit(scopeTree);
  return unused;
}

function isUnbraced(node) {
  return node && node.type !== 'Block';
}

exports.validate = function validate(rootPath, parseResult) {
  let { location, scopeTree, lineMap } = parseResult;

  for (let entry of parseResult.asi || []) {
    if (entry.type !== '}') {
      throw parseResult.createSyntaxError('Invalid ASI', entry.offset, entry.offset);
    }
  }

  for (let free of scopeTree.free) {
    if (!isGlobalName(free.value)) {
      throw parseResult.createSyntaxError(
        `Undeclared variable '${ free.value }'`,
        free.start,
        free.end
      );
    }
  }

  let unused = gatherUnusedDeclarations(scopeTree);

  rootPath.visit(new class LintVisitor {

    IfStatement(path) {
      let { consequent, alternate } = path.node;

      if (isUnbraced(consequent)) {
        throw parseResult.createSyntaxError('Unbraced if statement', consequent.start, consequent.end);
      } else if (isUnbraced(alternate) && alternate.type !== 'IfStatement') {
        throw parseResult.createSyntaxError('Unbraced if statement', alternate.start, alternate.end);
      }
    }

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
