import { createRunner } from '../runner.js';

const test = createRunner({ module: true, transformModules: true });

test('top level await', `
  import x from 'x';
  await 1;
`, `
  'use strict';

  (async function() {
    let _x = require('x');
    if (typeof _x === 'function') {
      _x = {
        default: _x
      };
    }
    await 1;
  })().catch((err) => setTimeout(() => {
    throw err;
  }, 0));
`);
