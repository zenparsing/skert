const Parser = require('./build/out/parser.js');
const Compiler = require('./build/out/compiler.js');

exports.compile = Compiler.compile;
exports.parse = Parser.parse;
