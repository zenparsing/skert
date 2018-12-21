import { compile } from '../src/index.js';
import * as assert from 'assert';

function normalize(code) {
  return code.trim().replace(/\n[ ]+/g, '\n');
}

export function createRunner(options) {
  function test(name, input, expected) {
    expected = normalize(expected);
    let result = compile(input, options);
    let actual = normalize(result.output);
    if (expected !== actual) {
      console.log(result.output);
    }
    assert.equal(actual, expected, name);
  };

  test.run = function(name, input, expected) {
    let { output } = compile('let value;\n' + input, options);
    let actual = new Function(output + '\nreturn value;')();
    if (expected !== actual) {
      console.log(actual);
    }
    assert.equal(actual, expected, name);
  };

  return test;
}
