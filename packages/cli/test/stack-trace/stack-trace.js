import { C, x } from './original.js';
import * as assert from 'assert';

function getStackLines(err) {
  return err.stack
    .split(/\n/g)
    .map(line => line.replace(import.meta.dirname, '').replace(/\\/g, '/'))
    .filter(line => !line.includes(' (internal/') && !line.includes('Module.compileOverride'))
    .slice(1);
}

try {
  new C().m();
} catch (err) {
  assert.deepEqual(getStackLines(err), [
    '    at (/stack-trace.js:13:11)',
    '    at C.m (/original.js:7:14)',
    '    at C.t (/original.js:8:15)',
  ]);
}

try {
  x();
} catch (err) {
  assert.deepEqual(getStackLines(err), [
    '    at (/stack-trace.js:23:3)',
    '    at x (/original.js:1:22)',
  ]);
}
