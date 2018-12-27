export function registerTransform({ define, templates, AST }) {
  define(rootPath => rootPath.visit(new class CallWithVisitor {

    CallWithExpression(path) {
      path.visitChildren(this);

      let { node } = path;
      let call = new AST.CallExpression(node.callee, node.arguments);

      if (node.subject.type === 'Identifier' || node.subject.type === 'ThisExpression') {
        node.arguments.unshift(node.subject);
        path.replaceNode(call);

      } else {

        let temp = path.uniqueIdentifier('_tmp', { kind: 'let' });
        node.arguments.unshift(new AST.Identifier(temp));
        path.replaceNode(templates.expression`
          (${ temp } = ${ node.subject }, ${ call })
        `);
      }
    }

  }));
}
