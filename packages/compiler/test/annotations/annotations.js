import { createRunner } from '../runner.js';

const test = createRunner({ module: false });

test('annotations', `
  #[a, b] function f() {}
`, `
  function f() {}
`);
