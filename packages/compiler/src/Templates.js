import { AST, parse } from './Parser.js';
import { Path } from './Path.js';

const PLACEHOLDER = '$$HOLE$$';

export function statement(literals, ...values) {
  return moduleTemplate(literals, ...values).statements[0];
}

export function statementList(literals, ...values) {
  return moduleTemplate(literals, ...values).statements;
}

export function expression(literals, ...values) {
  // TODO: Ideally this will treat leading { as object literal
  return moduleTemplate(literals, ...values).statements[0].expression;
}

export function moduleTemplate(literals, ...values) {
  let source = '';

  if (typeof literals === 'string') {
    source = literals;
  } else {
    for (let i = 0; i < literals.length; ++i) {
      source += literals[i];
      if (i < values.length) source += PLACEHOLDER;
    }
  }

  let result = parse(source, { module: true });
  if (values.length === 0) {
    return result.ast;
  }

  let path = new Path(result.ast);
  let index = 0;

  path.visit({

    after(path) {
      // Remove source offset data
      path.node.start = -1;
      path.node.end = -1;
    },

    Identifier(path) {
      if (path.node.value === PLACEHOLDER) {
        let value = values[index++];
        path.replaceNode(typeof value === 'string' ? new AST.Identifier(value) : value);
      }
    },

  });

  return result.ast;
}
