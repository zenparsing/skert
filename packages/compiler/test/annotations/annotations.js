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

modules.set('./macros/deprecated.js', {
  deprecated(ast) {
    ast.body.statements.unshift({
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            value: 'console',
          },
          property: {
            type: 'Identifier',
            value: 'warn',
          }
        },
        arguments: [{
          type: 'StringLiteral',
          value: 'This function is deprecated',
        }],
      },
    });
    return ast;
  }
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

test(`deprecated annotation`, `
  import { deprecated } from './macros/deprecated.js';

  #[deprecated]
  function dontUseMeAnymore() {
    eval('Bad idea, Petey!');
  }
`, `
  function dontUseMeAnymore() {
    console.warn('This function is deprecated');
    eval('Bad idea, Petey!');
  }
`);
