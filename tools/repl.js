const { registerLoader } = require('../build/out/cli.js');
const util = require('util');
const vm = require('vm');

registerLoader();

const { parse } = require('../packages/parser/src/index.js');
const { compile } = require('../packages/compiler/src/index.js');
const context = new Map();

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
  let result = compile(String.raw(strings, ...values), { context });
  return vm.runInThisContext(result.output);
};

global.skert = function(strings, ...values) {
  let result = compile(String.raw(strings, ...values), {
    module: true,
    transformModules: true,
  });

  console.log(result.output);
};
