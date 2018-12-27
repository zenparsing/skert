import { parse, print, AST } from './Parser.js';
import { Path } from './Path.js';
import { generateSourceMap, encodeInlineSourceMap, encodeSourceMapLink } from './SourceMap.js';
import { getTransforms } from './transforms/index.js';
import * as templates from './Templates.js';

function basename(file) {
  return file.replace(/^[^]*[\\/]([^\\/])|[\\/]+$/g, '$1');
}

class CompileResult {
  constructor({ output, mappings }) {
    this.output = output;
    this.mappings = mappings;
    this.sourceMap = null;
    this.context = null;
  }
}

export function compile(source, options = {}) {
  let parseResult = parse(source, { module: options.module, resolveScopes: true });
  let rootPath = Path.fromParseResult(parseResult);

  let transforms = getTransforms({
    transformModules: options.transformModules,
  });

  let context = options.context || new Map();
  let registry = registerTransforms(transforms, context);

  runProcessors(rootPath, registry);

  let result = new CompileResult(
    print(rootPath.node, { lineMap: parseResult.lineMap })
  );

  result.context = context;

  if (options.sourceMap) {
    let filename = basename(options.location);
    let map = generateSourceMap(result.mappings, {
      sources: [{
        file: filename,
        content: source,
        default: true,
      }],
    });

    if (options.sourceMap === 'inline') {
      result.output += encodeInlineSourceMap(map);
    } else {
      result.output += encodeSourceMapLink(`${ filename }.map`);
      result.sourceMap = map;
    }
  }

  return result;
}


function registerTransforms(transforms, context) {
  let registry = new Set();

  let api = {
    define(processor) { registry.add(processor); },
    templates,
    context,
    AST,
  };

  for (let module of transforms) {
    module.registerTransform(api);
  }

  return registry;
}

function runProcessors(rootPath, registry) {
  for (let processor of registry) {
    processor(rootPath);
    rootPath.applyChanges();
  }
}
