export function registerTransform({ define, templates, AST }) {
  define(rootPath => rootPath.visit(new class AsyncBlockVisitor {

    AsyncBlock(path) {
      path.visitChildren(this);

      let arrow = new AST.ArrowFunction(
        'async',
        [],
        new AST.FunctionBody(path.node.statements)
      );

      path.replaceNode(templates.statement`
        (${ arrow })().catch(e => { setTimeout(() => { throw e; }, 0); })
      `);
    }

  }));
}
