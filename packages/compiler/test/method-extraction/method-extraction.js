import { createRunner } from '../runner.js';

const test = createRunner({ module: false });

test('method extraction with identifier object', `
  &obj.fn
`, `
  Object.freeze(obj.fn.bind(obj));
`);

test('method extraction with complex object', `
  &(a.b.c.fn)
`, `
  let _tmp;
  (_tmp = a.b.c, Object.freeze(_tmp.fn.bind(_tmp)));
`);
