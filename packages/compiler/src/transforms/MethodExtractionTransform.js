export function registerTransform({ define, templates, AST }) {
  define(rootPath => rootPath.visit(new class MethodExtractionTransform {

    constructor() {
      this.helperName = null;
    }

    insertHelper() {
      if (this.helperName) {
        return this.helperName;
      }

      let mapName = rootPath.uniqueIdentifier('_methodMap', {
        kind: 'const',
        initializer: new AST.NewExpression(
          new AST.Identifier('WeakMap'),
          []
        ),
      })

      this.helperName = rootPath.uniqueIdentifier('_extractMethod', {
        kind: 'const',
        initializer: templates.expression`
          (obj, f) => {
            if (typeof f !== 'function') {
              throw new TypeError('Property is not a function');
            }
            let map = ${ mapName }.get(obj);
            if (map) {
              let fn = map.get(f);
              if (fn) {
                return fn;
              }
            } else {
              map = new WeakMap();
              ${ mapName }.set(obj, map);
            }
            let bound = Object.freeze(f.bind(obj));
            map.set(f, bound);
            return bound;
          }
        `,
      });

      return this.helperName;
    }

    UnaryExpression(path) {
      path.visitChildren(this);
      if (path.node.operator !== '&') {
        return;
      }

      let member = path.node.expression;
      while (member.type === 'ParenExpression') {
        member = member.expression;
      }

      let helper = this.insertHelper();

      if (member.object.type === 'Identifier') {
        path.replaceNode(templates.expression`
          ${ helper }(${ member.object }, ${ member })
        `);
      } else {
        let temp = path.uniqueIdentifier('_tmp', { kind: 'let' });
        path.replaceNode(templates.expression`
          (
            ${ temp } = ${ member.object },
            ${ helper }(${ temp }, ${ new AST.MemberExpression(temp, member.property) })
          )
        `);
      }
    }

  }));
}
