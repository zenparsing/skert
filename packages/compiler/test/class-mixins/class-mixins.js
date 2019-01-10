import { createRunner } from '../runner.js';

const test = createRunner({ module: true });

test.withContext('class declaration with mixin', `
  class A with B, C {}
`, `
  const _mixin = Symbol.mixin || Symbol.for('Symbol.mixin');
  const _classMixin = (target, ...sources) => {
    function copy(from, to) {
      for (let key of Reflect.ownKeys(from)) {
        if (!Reflect.getOwnPropertyDescriptor(to, key)) {
          Reflect.defineProperty(to, key, Reflect.getOwnPropertyDescriptor(from, key));
        }
      }
    }

    for (let source of sources) {
      let m = source[_mixin];
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

test.run('default mixins are correctly applied', `
  class A { x() { return 'Ax' } static y() { return 'Ay' } }
  class B { x() { return 'Bx' } z() { return 'Bz' } }
  class C with A, B {}
  let c = new C();
  value = [c.x(), C.y(), c.z()];
`, [
  'Ax', 'Ay', 'Bz'
]);

test.run('Symbol.mixin', `
  const mixin = {
    [Symbol.mixin](target) { target.foo = 42 }
  };
  class A with mixin {}
  value = A.foo;
`, 42);
