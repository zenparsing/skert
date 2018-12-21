import Module from 'module';
import * as path from 'path';
import { compile } from './Compiler.js';

const translationMappings = new Map();

class ModuleLoader {

  constructor(location) {
    if (!location) {
      location = path.join(process.cwd(), 'module-loader');
    }

    this.@location = location;
    this.@module = new Module(location, null);
    this.@module.filename = location;
    this.@module.paths = Module._nodeModulePaths(path.dirname(location));
  }

  resolve(specifier) {
    return Module._resolveFilename(specifier, this.@module, false, {});
  }

  load(specifier) {
    startModuleTranslation();
    try {
      return this.@module.require(this.resolve(specifier));
    } finally {
      endModuleTranslation();
    }
  }

}

export function registerLoader() {
  startModuleTranslation();
  return endModuleTranslation;
}

let originals = null;

function startModuleTranslation() {
  if (originals) {
    originals.refCount += 1;
    return;
  }

  originals = {
    refCount: 1,
    prepareStackTrace: Error.prepareStackTrace,
    compile: Module.prototype._compile,
  };

  Module.prototype._compile = compileOverride;
  Error.prepareStackTrace = prepareStackTraceOverride;
}

function endModuleTranslation() {
  originals.refCount -= 1;
  if (originals.refCount === 0) {
    Module.prototype._compile = originals.compile;
    Error.prepareStackTrace = originals.prepareStackTrace;
    originals = null;
  }
}

function shouldTranslate(filename) {
  // Don't translate files in node_modules
  return !/[/\\]node_modules[/\\]/i.test(filename);
}

function compileOverride(content, filename) {
  if (shouldTranslate(filename)) {
    let result = compile(removeShebang(content), {
      location: filename,
      module: true,
      transformModules: true,
    });
    content = result.output;
    if (result.mappings) {
      translationMappings.set(filename, result.mappings);
    }
  }
  return originals.compile.call(this, content, filename);
}

function removeShebang(content) {
  let match = content.startsWith('#!') && /[\r\n]/.exec(content);
  return match ? content.slice(match.index) : content;
}

function prepareStackTraceOverride(error, stack) {
  return error + stack
    .map(callSite => stringifyCallSite(callSite) || String(callSite))
    .map(frameString => '\n    at ' + frameString)
    .reverse()
    .join('');
}

function mapSourcePosition(mappings, line, column) {
  let right = mappings.length - 1;
  let left = 0;

  // Binary search over generated position
  while (left <= right) {
    let mid = (left + right) >> 1;
    let { generated } = mappings[mid];

    if (generated.line === line && generated.column === column) {
      right = mid;
      break;
    }

    if (
      generated.line < line ||
      generated.line === line && generated.column < column) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  if (right < 0) {
    return { line: 0, column: 0 };
  }

  return mappings[right].original;
}

function stringifyCallSite(callSite) {
  if (callSite.isNative() || callSite.isEval()) {
    return null;
  }

  let source = callSite.getFileName() || callSite.getScriptNameOrSourceURL();
  if (!source) {
    return null;
  }

  let mappings = translationMappings.get(source);
  if (!mappings) {
    return null;
  }

  let line = callSite.getLineNumber();
  let column = callSite.getColumnNumber();
  if (typeof line !== 'number' || typeof column !== 'number') {
    return null;
  }

  // Remove node CJS wrapper header
  let headerLength = 62;
  if (line === 1 && column > headerLength && !callSite.isEval()) {
    column -= headerLength;
  }

  ({ line, column } = mapSourcePosition(mappings, line - 1, column - 1));

  let location = `(${ source }:${ line + 1 }:${ column + 1 })`;
  let functionName = callSite.getFunctionName();

  if (callSite.isConstructor()) {
    return `new ${ functionName || '<anonymous>' } ${ location }`;
  }

  let methodName = callSite.getMethodName();
  if (methodName) {
    let typeName = callSite.getTypeName();
    if (!functionName) {
      functionName = `${ typeName }.${ methodName || '<anonymous>' }`;
    } else {
      if (!functionName.startsWith(typeName)) {
        functionName = typeName + '.' + functionName;
      }
      if (methodName && !functionName.endsWith('.' + methodName)) {
        functionName += `[as ${ methodName }]`;
      }
    }
  }

  if (functionName) {
    return `${ functionName } ${ location }`;
  }

  return location;
}
