export function registerTransform({ define, context, templates, AST }) {
  define(rootPath => rootPath.visit(new class SymbolNameVisitor {

    constructor() {
      let names = context.get('symbolNames');
      if (!names) {
        names = new Map();
        context.set('symbolNames', names);
      }

      this.names = names;
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
