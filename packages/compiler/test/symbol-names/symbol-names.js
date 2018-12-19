import { createRunner } from '../runner.js';

const test = createRunner({ module: true });

test('symbol name reference', `
  x.@y = 1;
`, `
  const $y = Symbol('@y');
  x[$y] = 1;
`);

test('symbol named methods', `
  ({ @x() {} });
`, `
  const $x = Symbol('@x');
  ({
    [$x]() {}
  });
`);

test('symbol name primary expression', `
  @x = 1;
`, `
  const $x = Symbol('@x');
  this[$x] = 1;
`);
