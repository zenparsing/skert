import * as AsyncBlockTransform from './AsyncBlockTransform.js';
import * as SymbolNameTransform from './SymbolNameTransform.js';
import * as ModuleTransform from './ModuleTransform.js';
import * as MethodExtractionTransform from './MethodExtractionTransform.js';
import * as CallWithTransform from './CallWithTransform.js';

export function getTransforms(options = {}) {
  let list = [
    AsyncBlockTransform,
    SymbolNameTransform,
    MethodExtractionTransform,
    CallWithTransform,
  ];

  if (options.transformModules) {
    list.push(ModuleTransform);
  }

  return list;
}
