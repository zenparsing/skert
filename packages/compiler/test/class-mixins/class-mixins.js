import { createRunner } from '../runner.js';

const test = createRunner({ module: true });

test.withContext('class declaration with mixin', `
  class A with B, C {}
`, `
  const _mixin = Symbol.mixin || Symbol.for('Symbol.mixin');
  const _classMixin = (target, ...sources) => {
    function copy(from, to, skip) {
      for (let key of Reflect.ownKeys(from)) {
        if (key === skip || Reflect.getOwnPropertyDescriptor(to, key)) {
          continue;
        }
        Reflect.defineProperty(to, key, Reflect.getOwnPropertyDescriptor(from, key));
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
      copy(source, target, 'prototype');
      if (source.prototype) {
        copy(source.prototype, target.prototype, 'constructor');
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
