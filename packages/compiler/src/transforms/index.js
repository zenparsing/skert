import * as AsyncExpressionTransform from './AsyncExpressionTransform.js';
import * as SymbolNameTransform from './SymbolNameTransform.js';
import * as ModuleTransform from './ModuleTransform.js';

export function getTransforms(options = {}) {
  let list = [
    AsyncExpressionTransform,
    SymbolNameTransform,
  ];

  if (options.transformModules) {
    list.push(ModuleTransform);
  }

  return list;
}
