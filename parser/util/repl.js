import { parse } from '../src/index.js';
import * as util from 'util';

const HELP = `
== Global Variables ==

ast  (template tag) : Prints a script AST
astm (template tag) : Prints a module AST
parse               : Parses JS and returns a ParseResult
`;

function printAST(input, options) {
  let result = parse(input, options);
  console.log(util.inspect(result.ast, {
    colors: true,
    depth: 50,
  }));
}

Object.defineProperty(global, 'help', {
  get() { console.log(HELP) }
});

global.parse = parse;

global.ast = function(strings, ...values) {
  printAST(String.raw(strings, ...values));
};

global.astm = function(strings, ...values) {
  printAST(String.raw(strings, ...values), { module: true });
};
