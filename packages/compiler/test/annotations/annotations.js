import { createRunner } from '../runner.js';

const modules = new Map();

modules.set('a', {
  a() {
    return {
      type: 'ExpressionStatement',
      expression: {
        type: 'StringLiteral',
        value: 'hello world',
      },
    };
  },
});

const test = createRunner({
  module: true,
  loadModule: specifier => modules.get(specifier),
});

test('annotations', `
  import { a } from 'a';
  #[a] function f() {}
`, `
  'hello world';
`);
