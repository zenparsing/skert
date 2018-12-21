import { createRunner } from '../runner.js';

const test = createRunner({ module: false });

test('call with expression', `
  obj->foo.bar(1, 2);
`, `
  foo.bar(obj, 1, 2);
`);
