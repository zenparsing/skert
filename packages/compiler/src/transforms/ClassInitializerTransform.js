export function registerTransform({ define, templates, AST }) {
  define(rootPath => rootPath.visit(new class ClassMixinVisitor {

    constructor() {
      this.stack = [];
    }

    createInitializerFunction(initializers) {
      if (initializers.length === 0) {
        return null;
      }

      let fn = new AST.FunctionExpression('', null, [], new AST.FunctionBody([]));

      for (let init of initializers) {
        for (let statement of init.statements) {
          fn.body.statements.push(statement);
        }
      }

      return fn;
    }

    ClassInitializer(path) {
      this.stack[this.stack.length - 1].push(path.node);
      path.removeNode();
    }

    ClassDeclaration(path) {
      this.stack.push([]);
      path.visitChildren(this);
      let list = this.stack.pop();

      let init = this.createInitializerFunction(list);
      if (!init) {
        return;
      }

      let { node } = path;

      // Add an identifier for default class exports
      if (!node.identifier) {
        node.identifier = new AST.Identifier(path.uniqueIdentifier('_class'));
      }

      let name = new AST.Identifier(node.identifier.value);

      switch (path.parentNode.type) {
        case 'ExportDeclaration':
        case 'ExportDefault':
          path = path.parent;
          break;
      }

      path.insertNodesAfter(templates.statement`
        (${ init }).call(${ name });
      `);
    }

    ClassExpression(path) {
      this.stack.push([]);
      path.visitChildren(this);
      let list = this.stack.pop();

      let init = this.createInitializerFunction(list);
      if (!init) {
        return;
      }

      let replaced = templates.expression`
        (${ init }).call(${ path.node })
      `;

      if (path.parentNode.type === 'NewExpression') {
        replaced = new AST.ParenExpression(replaced);
      }

      path.replaceNode(replaced);
    }

  }));
}
