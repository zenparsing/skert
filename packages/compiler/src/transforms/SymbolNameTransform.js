export function register({ define, templates, AST }) {
  define(rootPath => rootPath.visit(new class SymbolNameVisitor {

    constructor() {
      @names = new Map();
    }

    @replaceRef(path, name) {
      path.replaceNode(new AST.ComputedPropertyName(
        new AST.Identifier(name)
      ));
    }

    @replacePrimary(path, name) {
      path.replaceNode(new AST.MemberExpression(
        new AST.ThisExpression(),
        new AST.ComputedPropertyName(
          new AST.Identifier(name)
        )
      ));
    }

    @getIdentifierName(value) {
      if (@names.has(value)) {
        return @names.get(value);
      }

      let name = rootPath.uniqueIdentifier('$' + value.slice(1), {
        kind: 'const',
        initializer: new AST.CallExpression(
          new AST.Identifier('Symbol'),
          [new AST.StringLiteral(value)]
        ),
      });

      @names.set(value, name);
      return name;
    }

    SymbolName(path) {
      let name = @getIdentifierName(path.node.value);
      switch (path.parent.node.type) {
        case 'PropertyDefinition':
        case 'MethodDefinition':
        case 'ClassField':
          @replaceRef(path, name);
          break;
        case 'MemberExpression':
          if (path.parent.node.object === path.node) {
            @replacePrimary(path, name);
          } else {
            @replaceRef(path, name);
          }
          break;
        default:
          @replacePrimary(path, name);
          break;
      }
    }

  }));
}
