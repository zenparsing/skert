import { compile } from '../src/index.js';
import * as assert from 'assert';

function normalize(code) {
  return code.trim().replace(/\n[ ]+/g, '\n');
}

function testCompile(name, input, expected, options) {
  expected = normalize(expected);
  let result = compile(input, options);
  let actual = normalize(result.output);
  if (expected !== actual) {
    console.log(result.output);
  }
  assert.equal(actual, expected, name);
}

export function createRunner(options) {
  let context = new Map();

  function test(name, input, expected) {
    testCompile(name, input, expected, options);
  };

  test.withContext = function(name, input, expected) {
    testCompile(name, input, expected, { ...options, context });
  };

  test.run = function(name, input, expected) {
    let { output } = compile('let value;\n' + input, options);
    let actual = new Function(output + '\nreturn value;')();
    try {
      assert.deepStrictEqual(actual, expected, name);
    } catch (err) {
      console.log(actual);
      throw err;
    }
  };

  return test;
}
