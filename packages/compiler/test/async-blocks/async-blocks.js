import { createRunner } from '../runner.js';

const test = createRunner({ module: false });

test('async blocks', `
  async { await 1 }
`, `
  (async () => {
    await 1;
  })();
`);
