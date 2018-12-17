import { parse, print, AST } from './Parser.js';
import { Path } from './Path.js';
import { generateSourceMap, encodeInlineSourceMap, encodeSourceMapLink } from './SourceMap.js';
import * as ModuleTransform from './transforms/ModuleTransform.js';
import * as SymbolNameTransform from './transforms/SymbolNameTransform.js';
import * as Templates from './Templates.js';

function basename(file) {
  return file.replace(/^[^]*[\\/]([^\\/])|[\\/]+$/g, '$1');
}

export function compile(source, options = {}) {
  let parseResult = parse(source, { module: options.module, resolveScopes: true });
  let rootPath = Path.fromParseResult(parseResult);

  let transforms = [SymbolNameTransform];
  if (options.transformModules) {
    transforms.push(ModuleTransform);
  }

  let registry = registerTransforms(transforms);
  runProcessors(rootPath, registry);
  let result = print(rootPath.node, { lineMap: parseResult.lineMap });

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


function registerTransforms(transforms) {
  let registry = new Set();

  let api = {
    define(processor) { registry.add(processor); },
    templates: Templates,
    AST,
  };

  for (let module of transforms) {
    module.register(api);
  }

  return registry;
}

function runProcessors(rootPath, registry) {
  for (let processor of registry) {
    processor(rootPath);
    rootPath.applyChanges();
  }
}
