import { createRunner } from '../runner.js';

const test = createRunner({ module: true });

test('null-or', `
  x ?? y;
`, `
  (x != null ? x : y);
`);

test('null-or with complex LHS', `
  x.y ?? z
`, `
  let _temp;
  (_temp = x.y, _temp != null ? _temp : z);
`);
