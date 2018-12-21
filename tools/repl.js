const { registerLoader } = require('../build/out/cli.js');
const util = require('util');

registerLoader();

const { parse } = require('../packages/parser/src/index.js');
const { compile } = require('../packages/compiler/src/index.js');

function printAST(input, options) {
  let result = parse(input, options);
  console.log(util.inspect(result.ast, {
    colors: true,
    depth: 50,
  }));
}

global.parse = parse;

global.compile = compile;

global.ast = function(strings, ...values) {
  printAST(String.raw(strings, ...values), { module: true });
};

global.astScript = function(strings, ...values) {
  printAST(String.raw(strings, ...values), { module: false });
};

global.exec = function(strings, ...values) {
  let result = compile(String.raw(strings, ...values));
  return eval(result.output);
};

global.skert = function(strings, ...values) {
  let result = compile(String.raw(strings, ...values), {
    module: true,
    transformModules: true,
  });

  console.log(result.output);
};
