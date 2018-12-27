export function registerTransform({ define, templates, AST }) {
  define(rootPath => rootPath.visit(new class SymbolNameVisitor {

    constructor() {
      this.names = new Map();
    }

    getIdentifierName(value) {
      if (this.names.has(value)) {
        return this.names.get(value);
      }

      let name = rootPath.uniqueIdentifier('$' + value.slice(1), {
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
      path.replaceNode(new AST.ComputedPropertyName(
        new AST.Identifier(this.getIdentifierName(path.node.value))
      ));
    }

  }));
}
