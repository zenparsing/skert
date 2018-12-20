import { createRunner } from '../runner.js';

const test = createRunner({ module: false });

test('async expression', `
  async { await 1 };
`, `
  (async () => {
    await 1;
  })();
`);

test('async expressions are primary', `
  async {}.then;
`, `
  (async () => {})().then;
`);
