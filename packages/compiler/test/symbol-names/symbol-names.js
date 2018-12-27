import { createRunner } from '../runner.js';

const test = createRunner({ module: true });

test.withContext('symbol name reference', `
  x.@y = 1;
`, `
  const $y = Symbol('@y');
  x[$y] = 1;
`);

test.withContext('symbol names are added to context', `
  x.@y = 1;
`, `
  x[$y] = 1;
`)

test('symbol named methods', `
  ({ @x() {} });
`, `
  const $x = Symbol('@x');
  ({
    [$x]() {}
  });
`);
