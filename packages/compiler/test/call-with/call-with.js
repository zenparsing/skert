import { createRunner } from '../runner.js';

const test = createRunner({ module: false });

test('call with expression', `
  obj->foo.bar(1, 2);
`, `
  foo.bar(obj, 1, 2);
`);

test('call with complex subject', `
  obj.a->foo.bar(1, 2);
`, `
  let _tmp;
  (_tmp = obj.a, foo.bar(_tmp, 1, 2));
`);

test('chained call with', `
  obj.a->foo()->bar(2);
`, `
  let _tmp_1;
  let _tmp;
  (_tmp_1 = (_tmp = obj.a, foo(_tmp)), bar(_tmp_1, 2));
`);
