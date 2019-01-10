export class ParseError extends Error {
  constructor(msg, span) {
    super(msg);
    this.name = 'ParseError';
    this.startOffset = span.start;
    this.endOffset = span.end;
  }
}

export function createSyntaxError(msg, options = {}) {
  let loc = options.lineMap.locate(options.startOffset);

  let err = new SyntaxError(msg +
    `\n    at (${ options.location }:${ loc.line + 1 }:${ loc.column })`
  );

  err.location = options.location;
  err.line = loc.line;
  err.column = loc.column;
  err.lineOffset = loc.lineOffset;
  err.startOffset = options.startOffset;
  err.endOffset = options.endOffset;

  return err;
}
