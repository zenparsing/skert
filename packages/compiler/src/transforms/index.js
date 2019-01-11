import * as SymbolNameTransform from './SymbolNameTransform.js';
import * as MethodExtractionTransform from './MethodExtractionTransform.js';
import * as CallWithTransform from './CallWithTransform.js';
import * as NullCoalescingTransform from './NullCoalescingTransform.js';
import * as AnnotationTransform from './AnnotationTransform.js';
import * as ClassMixinTransform from './ClassMixinTransform.js';
import * as ModuleTransform from './ModuleTransform.js';

export function getTransforms(options = {}) {
  let list = [
    SymbolNameTransform,
    MethodExtractionTransform,
    CallWithTransform,
    NullCoalescingTransform,
    AnnotationTransform,
    ClassMixinTransform,
  ];

  if (options.transformModules) {
    list.push(ModuleTransform);
  }

  return list;
}
