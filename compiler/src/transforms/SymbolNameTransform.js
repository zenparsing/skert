export function register({ define, templates, AST }) {
  define(rootPath => rootPath.visit(new class SymbolNameVisitor {

    constructor() {
      this.names = new Map();
    }

    getIdentifierName(value) {
      if (this.names.has(value)) {
        return this.names.get(value);
      }

      let name = rootPath.uniqueIdentifier(value.slice(1), {
        kind: 'const',
        initializer: new AST.CallExpression(
          new AST.Identifier('Symbol'),
          [new AST.StringLiteral(value)]
        ),
      });

      this.names.set(value, name);
      return name;
    }

    SymbolName(path) {
      let name = this.getIdentifierName(path.node.value);
      switch (path.parent.node.type) {
        case 'MemberExpression':
        case 'PropertyDefinition':
        case 'MethodDefinition':
        case 'ClassField':
          path.replaceNode(new AST.ComputedPropertyName(
            new AST.Identifier(name)
          ));
          break;
        default:
          path.replaceNode(new AST.MemberExpression(
            new AST.ThisExpression(),
            new AST.ComputedPropertyName(
              new AST.Identifier(name)
            )
          ));
          break;
      }
    }

  }));
}
