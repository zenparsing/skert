export function registerTransform({ define, context, templates, AST }) {
  define(rootPath => rootPath.visit(new class ClassMixinVisitor {

    constructor() {
      this.helperName = context.get('classMixinHelper') || '';
      this.symbolName = context.get('classMixinSymbol') || '';
    }

    insertSymbol() {
      if (this.symbolName) {
        return this.symbolName;
      }

      this.symbolName = rootPath.uniqueIdentifier('_mixin', {
        kind: 'const',
        initializer: templates.expression`
          Symbol.mixin || Symbol.for('Symbol.mixin')
        `,
      });

      context.set('classMixinSymbol', this.symbolName);

      return this.symbolName;
    }

    insertHelper() {
      if (this.helperName) {
        return this.helperName;
      }

      this.insertSymbol();

      this.helperName = rootPath.uniqueIdentifier('_classMixin', {
        kind: 'const',
        initializer: templates.expression`
          (target, ...sources) => {
            function copy(from, to) {
              for (let key of Reflect.ownKeys(from)) {
                if (!Reflect.getOwnPropertyDescriptor(to, key)) {
                  Reflect.defineProperty(to, key, Reflect.getOwnPropertyDescriptor(from, key));
                }
              }
            }

            for (let source of sources) {
              let m = source[${ this.symbolName }];
              if (m !== undefined) {
                if (typeof m !== 'function') {
                  throw new TypeError('Expected Symbol.mixin method to be a function');
                }
                m.call(source, target);
                continue;
              }

              if (typeof source !== 'function') {
                throw new TypeError('Invalid mixin source');
              }

              copy(source, target);
              if (source.prototype) {
                copy(source.prototype, target.prototype);
              }
            }

            return target;
          }
        `,
      });

      context.set('classMixinHelper', this.helperName);

      return this.helperName;
    }

    ClassDeclaration(path) {
      path.visitChildren(this);

      let { node } = path;
      let { mixins } = node;

      if (!mixins) {
        return;
      }

      // Add an identifier for default class exports
      if (!node.identifier) {
        node.identifier = new AST.Identifier(path.uniqueIdentifier('_class'));
      }

      let name = new AST.Identifier(node.identifier.value);
      let helper = this.insertHelper();

      switch (path.parentNode.type) {
        case 'ExportDeclaration':
        case 'ExportDefault':
          path = path.parent;
          break;
      }

      path.insertNodesAfter(new AST.ExpressionStatement(
        new AST.CallExpression(
          new AST.Identifier(helper),
          [name, ...mixins]
        )
      ));
    }

    ClassExpression(path) {
      path.visitChildren(this);

      let { mixins } = path.node;
      if (!mixins) {
        return;
      }

      let helper = this.insertHelper();
      let replaced = new AST.CallExpression(
        new AST.Identifier(helper),
        [path.node, ...mixins]
      );

      if (path.parentNode.type === 'NewExpression') {
        replaced = new AST.ParenExpression(replaced);
      }

      path.replaceNode(replaced);
    }

    MemberExpression(path) {
      let { object, property } = path.node;

      if (
        object.type === 'Identifier' && object.value === 'Symbol' &&
        property.type === 'Identifier' && property.value === 'mixin'
      ) {
        path.replaceNode(new AST.Identifier(this.insertSymbol()));
      }
    }

  }));
}
