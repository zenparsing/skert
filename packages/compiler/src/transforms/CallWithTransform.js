export function register({ define, templates, AST }) {
  define(rootPath => rootPath.visit(new class CallWithVisitor {

    CallWithExpression(path) {
      path.visitChildren(this);

      let { node } = path;

      node.arguments.unshift(node.subject);

      path.replaceNode(new AST.CallExpression(
        node.callee,
        node.arguments,
        node.trailingComma,
      ));
    }

  }));
}
