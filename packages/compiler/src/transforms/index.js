import * as AsyncBlockTransform from './AsyncBlockTransform.js';
import * as SymbolNameTransform from './SymbolNameTransform.js';
import * as ModuleTransform from './ModuleTransform.js';
import * as MethodExtractionTransform from './MethodExtractionTransform.js';
import * as CallWithTransform from './CallWithTransform.js';
import * as NullOrTransform from './NullOrTransform.js';

export function getTransforms(options = {}) {
  let list = [
    AsyncBlockTransform,
    SymbolNameTransform,
    MethodExtractionTransform,
    CallWithTransform,
    NullOrTransform,
  ];

  if (options.transformModules) {
    list.push(ModuleTransform);
  }

  return list;
}
