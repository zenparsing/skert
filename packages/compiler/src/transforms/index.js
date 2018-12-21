import * as AsyncExpressionTransform from './AsyncExpressionTransform.js';
import * as SymbolNameTransform from './SymbolNameTransform.js';
import * as ModuleTransform from './ModuleTransform.js';
import * as MethodExtractionTransform from './MethodExtractionTransform.js';

export function getTransforms(options = {}) {
  let list = [
    AsyncExpressionTransform,
    SymbolNameTransform,
    MethodExtractionTransform,
  ];

  if (options.transformModules) {
    list.push(ModuleTransform);
  }

  return list;
}
