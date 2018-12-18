import { parse } from '../../src/index.js';
import { runTests } from '../runner.js';

runTests({
  dir:  __dirname,
  process: (input, options) => parse(input, options).ast,
  ignoreKeys: [
    'start',
    'end',
    'message',
    'context',
    'error',
    'suffix',
  ],
});
