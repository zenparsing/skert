export function register({ define, templates, AST }) {
  define(rootPath => rootPath.visit(new class AsyncExpressionVisitor {
    AsyncExpression(path) {
      path.visitChildren(this);
      path.replaceNode(
        new AST.CallExpression(
          new AST.ParenExpression(
            new AST.ArrowFunction('async', [], path.node.body)
          ),
          []
        ),
      );
    }
  }));
}
