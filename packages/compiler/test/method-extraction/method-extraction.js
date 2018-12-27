import { createRunner } from '../runner.js';

const test = createRunner({ module: false });

test.withContext('method extraction with identifier object', `
  &obj.fn
`, `
  const _methodMap = new WeakMap();
  const _extractMethod = (obj, f) => {
    if (typeof f !== 'function') {
      throw new TypeError('Property is not a function');
    }
    let map = _methodMap.get(obj);
    if (map) {
      let fn = map.get(f);
      if (fn) {
        return fn;
      }
    } else {
      map = new WeakMap();
      _methodMap.set(obj, map);
    }
    let bound = Object.freeze(f.bind(obj));
    map.set(f, bound);
    return bound;
  };
  _extractMethod(obj, obj.fn);
`);

test.withContext('helper is stored in context', `
  &obj.fn
`, `
  _extractMethod(obj, obj.fn);
`);

test.withContext('method extraction with complex object', `
  &(a.b.c.fn)
`, `
  let _tmp;
  (_tmp = a.b.c, _extractMethod(_tmp, _tmp.fn));
`);

test.run('method extraction', `
  const obj = { x: 1, m() { return this.x } };
  const m = &obj.m;
  value = m();
`, 1);

test.run('method extraction is idempotent', `
  const obj = { x: 1, m() { return this.x } };
  value = &obj.m === &obj.m;
`, true);

test.run('extracted methods are frozen', `
  let m = &{ m() {} }.m;
  m.x = 1;
  value = m.x;
`, undefined);
