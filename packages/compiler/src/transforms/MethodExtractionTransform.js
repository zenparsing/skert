export function register({ define, templates, AST }) {
  define(rootPath => rootPath.visit(new class MethodExtractionTransform {

    UnaryExpression(path) {
      path.visitChildren(this);
      if (path.node.operator !== '&') {
        return;
      }

      let member = path.node.expression;
      while (member.type === 'ParenExpression') {
        member = member.expression;
      }

      // We'll need to store methods in a WeakMap in order
      // to be "deterministic with respect to inputs"
      // i.e. idempotent

      if (member.object.type === 'Identifier') {
        path.replaceNode(templates.expression`
          Object.freeze(${ member }.bind(${ member.object }))
        `);
      } else {
        let temp = path.uniqueIdentifier('_tmp', { kind: 'let' });
        path.replaceNode(templates.expression`
          (
            ${ temp } = ${ member.object },
            Object.freeze(${ new AST.MemberExpression(temp, member.property) }.bind(${ temp }))
          )
        `);
      }
    }

  }));
}
