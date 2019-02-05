import { createRunner } from '../runner.js';

const test = createRunner({ module: true });

test.withContext('class declaration with mixin', `
  class A with B, C {}
`, `
  const _classMixin = (target, ...sources) => {
    function copy(from, to) {
      for (; from; from = Reflect.getPrototypeOf(from)) {
        for (let key of Reflect.ownKeys(from)) {
          if (!Reflect.getOwnPropertyDescriptor(to, key)) {
            Reflect.defineProperty(to, key, Reflect.getOwnPropertyDescriptor(from, key));
          }
        }
      }
    }

    for (let source of sources) {
      copy(source, target);
      if (source.prototype) {
        copy(source.prototype, target.prototype);
      }
    }
    return target;
  };

  class A {}

  _classMixin(A, B, C);
`);

test.withContext('class expression with mixin', `
  let C = class with A, B {};
`, `
  let C = _classMixin(class {}, A, B);
`);

test.withContext('exported class', `
  export class A with B {}
`, `
  export class A {}

  _classMixin(A, B);
`);

test.withContext('exported default class', `
  export default class with B {}
`, `
  export default class _class {}

  _classMixin(_class, B);
`);

test.withContext('exported default named class', `
  export default class A with B {}
`, `
  export default class A {}

  _classMixin(A, B);
`);

test.withContext('new expression mixin', `
  new class A with B {}
`, `
  new (_classMixin(class A {}, B));
`);

test.run('mixins are correctly applied', `
  class A { x() { return 'Ax' } static y() { return 'Ay' } }
  class B { x() { return 'Bx' } z() { return 'Bz' } }
  class C with A, B {}
  let c = new C();
  value = [c.x(), C.y(), c.z()];
`, [
  'Ax', 'Ay', 'Bz'
]);

test.run('mixins copy from the prototype chain', `
  class A { p() {} static s() {} }
  class B extends A {}
  class C with B {}
  value = [typeof C.prototype.p, typeof C.s];
`, [
  'function', 'function'
]);
