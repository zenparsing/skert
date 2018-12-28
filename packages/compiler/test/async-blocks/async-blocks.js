import { createRunner } from '../runner.js';

const test = createRunner({ module: false });

test('async blocks', `
  async { await 1 }
`, `
  (async () => {
    await 1;
  })().catch((e) => {
    setTimeout(() => {
      throw e;
    }, 0);
  });
`);
