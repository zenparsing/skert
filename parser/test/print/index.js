import { parse, print } from '../../src/default.js';
import { runTests } from '../runner.js';

function process(source, options) {
  return print(parse(source, options).ast).output;
}

function normalize(v) {
  return v.replace(/\n[ ]+\n/g, '\n\n');
}

function compare(a, b) {
  return normalize(a) === normalize(b);
}

runTests({
  dir:  __dirname,
  process,
  compare,
});
