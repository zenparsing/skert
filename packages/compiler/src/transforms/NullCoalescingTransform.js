export function registerTransform({ define, templates, AST }) {
  define(rootPath => rootPath.visit(new class NullCoalescingVisitor {

    BinaryExpression(path) {
      path.visitChildren(true);
      let { node } = path;
      if (node.operator !== '??') {
        return;
      }

      if (node.left.type === 'Identifier') {
        path.replaceNode(templates.expression`
          (${ node.left } != null ? ${ node.left } : ${ node.right })
        `);
      } else {
        let temp = path.uniqueIdentifier('_temp', { kind: 'let' });
        path.replaceNode(templates.expression`
          (
            ${ temp } = ${ node.left },
            ${ temp } != null ? ${ temp } : ${ node.right }
          )
        `);
      }
    }

  }));
}
