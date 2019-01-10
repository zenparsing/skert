import { Parser } from './Parser.js';
import { Printer } from './Printer.js';
import { ScopeResolver } from './ScopeResolver.js';
import * as AST from './AST.js';

export { AST, parse, print, resolveScopes };

function print(ast, options) {
  return new Printer().print(ast, options);
}

function parse(input, options = {}) {
  let parser = new Parser(input, options);
  try {
    let result = options.module ? parser.parseModule() : parser.parseScript();
    if (options.resolveScopes) {
      result.scopeTree = resolveScopes(result.ast);
    }
    return result;
  } catch (err) {
    throw err.name === 'ParseError'
      ? parser.createSyntaxError(err.message, err.span)
      : err;
  }
}

function resolveScopes(ast, parseResult) {
  try {
    return new ScopeResolver().resolve(ast);
  } catch (err) {
    throw err.name === 'ParseError' && parseResult
      ? parseResult.createSyntaxError(err.message, err.span)
      : err;
  }
}
