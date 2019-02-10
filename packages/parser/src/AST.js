export function forEachChild(node, fn) {
  if (node.forEachChild) {
    node.forEachChild(fn);
  } else {
    visitGenericNode(node, fn);
  }
}

function visitGenericNode(node, fn) {
  let keys = Object.keys(node);

  for (let i = 0; i < keys.length; ++i) {
    let key = keys[i];
    let value = node[key];

    if (Array.isArray(value)) {
      for (let j = 0; j < value.length; ++j) {
        if (isNode(value[j])) {
          fn(value[j], key, j);
        }
      }
    } else if (isNode(value)) {
      fn(value, key);
    }
  }
}

function isNode(x) {
  return x !== null && typeof x === 'object' && typeof x.type === 'string';
}

function visit(fn, value, key) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      fn(value[i], key, i);
    }
  } else if (value) {
    fn(value, key);
  }
}

export class Node {
  constructor() {
    this.type = this.constructor.name;
    this.start = -1;
    this.end = -1;
  }

  forEachChild() {}
}

export class Identifier extends Node {
  constructor(value, context) {
    super();
    this.value = value;
    this.context = context;
  }
}

export class NumberLiteral extends Node {
  constructor(value, suffix) {
    super();
    this.value = value;
    this.suffix = suffix;
  }
}

export class StringLiteral extends Node {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class TemplatePart extends Node {
  constructor(value, raw, templateEnd) {
    super();
    this.value = value;
    this.raw = raw;
    this.templateEnd = templateEnd;
  }
}

export class RegularExpression extends Node {
  constructor(value, flags) {
    super();
    this.value = value;
    this.flags = flags;
  }
}

export class BooleanLiteral extends Node {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class SymbolName extends Node {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class MetaProperty extends Node {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
}

export class NullLiteral extends Node {}

export class ThisExpression extends Node {}

export class SuperKeyword extends Node {}

export class Script extends Node {
  constructor(statements) {
    super();
    this.statements = statements;
  }

  forEachChild(fn) {
    visit(fn, this.statements, 'statements');
  }
}

export class Module extends Node {
  constructor(statements) {
    super();
    this.statements = statements;
  }

  forEachChild(fn) {
    visit(fn, this.statements, 'statements');
  }
}

export class SequenceExpression extends Node {
  constructor(expressions) {
    super();
    this.expressions = expressions;
  }

  forEachChild(fn) {
    visit(fn, this.expressions, 'expressions');
  }
}

export class AssignmentExpression extends Node {
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  forEachChild(fn) {
    visit(fn, this.left, 'left');
    visit(fn, this.right, 'right');
  }
}

export class SpreadExpression extends Node {
  constructor(expression) {
    super();
    this.expression = expression;
  }

  forEachChild(fn) {
    visit(fn, this.expression, 'expression');
  }
}

export class YieldExpression extends Node {
  constructor(delegate, expression) {
    super();
    this.delegate = delegate;
    this.expression = expression;
  }

  forEachChild(fn) {
    visit(fn, this.expression, 'expression');
  }
}

export class ConditionalExpression extends Node {
  constructor(test, consequent, alternate) {
    super();
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }

  forEachChild(fn) {
    visit(fn, this.test, 'test');
    visit(fn, this.consequent, 'consequent');
    visit(fn, this.alternate, 'alternate');
  }
}

export class BinaryExpression extends Node {
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  forEachChild(fn) {
    visit(fn, this.left, 'left');
    visit(fn, this.right, 'right');
  }
}

export class UpdateExpression extends Node {
  constructor(operator, expression, prefix) {
    super();
    this.operator = operator;
    this.expression = expression;
    this.prefix = prefix;
  }

  forEachChild(fn) {
    visit(fn, this.expression, 'expression');
  }
}

export class UnaryExpression extends Node {
  constructor(operator, expression) {
    super();
    this.operator = operator;
    this.expression = expression;
  }

  forEachChild(fn) {
    visit(fn, this.expression, 'expression');
  }
}

export class MemberExpression extends Node {
  constructor(object, property) {
    super();
    this.object = object;
    this.property = property;
  }

  forEachChild(fn) {
    visit(fn, this.object, 'object');
    visit(fn, this.property, 'property');
  }
}

export class CallExpression extends Node {
  constructor(callee, args, trailingComma) {
    super();
    this.callee = callee;
    this.arguments = args;
    this.trailingComma = trailingComma;
  }

  forEachChild(fn) {
    visit(fn, this.callee, 'callee');
    visit(fn, this.arguments, 'arguments');
  }
}

export class CallWithExpression extends Node {
  constructor(subject, callee, args, trailingComma) {
    super();
    this.subject = subject;
    this.callee = callee;
    this.arguments = args;
    this.trailingComma = trailingComma;
  }

  forEachChild(fn) {
    visit(fn, this.subject, 'subject');
    visit(fn, this.callee, 'callee');
    visit(fn, this.arguments, 'arguments');
  }
}

export class TemplateExpression extends Node {
  constructor(parts) {
    super();
    this.parts = parts;
  }

  forEachChild(fn) {
    visit(fn, this.parts, 'parts');
  }
}

export class TaggedTemplateExpression extends Node {
  constructor(tag, template) {
    super();
    this.tag = tag;
    this.template = template;
  }

  forEachChild(fn) {
    visit(fn, this.tag, 'tag');
    visit(fn, this.template, 'template');
  }
}

export class NewExpression extends Node {
  constructor(callee, args, trailingComma) {
    super();
    this.callee = callee;
    this.arguments = args;
    this.trailingComma = trailingComma;
  }

  forEachChild(fn) {
    visit(fn, this.callee, 'callee');
    visit(fn, this.arguments, 'arguments');
  }
}

export class ParenExpression extends Node {
  constructor(expression) {
    super();
    this.expression = expression;
  }

  forEachChild(fn) {
    visit(fn, this.expression, 'expression');
  }
}

export class ObjectLiteral extends Node {
  constructor(properties, trailingComma) {
    super();
    this.properties = properties;
    this.trailingComma = trailingComma;
  }

  forEachChild(fn) {
    visit(fn, this.properties, 'properties');
  }
}

export class ComputedPropertyName extends Node {
  constructor(expression) {
    super();
    this.expression = expression;
  }

  forEachChild(fn) {
    visit(fn, this.expression, 'expression');
  }
}

export class PropertyDefinition extends Node {
  constructor(name, expression) {
    super();
    this.name = name;
    this.expression = expression;
  }

  forEachChild(fn) {
    visit(fn, this.name, 'name');
    visit(fn, this.expression, 'expression');
  }
}

export class ObjectPattern extends Node {
  constructor(properties, trailingComma) {
    super();
    this.properties = properties;
    this.trailingComma = trailingComma;
  }

  forEachChild(fn) {
    visit(fn, this.properties, 'properties');
  }
}

export class PatternProperty extends Node {
  constructor(name, pattern, initializer) {
    super();
    this.name = name;
    this.pattern = pattern;
    this.initializer = initializer;
  }

  forEachChild(fn) {
    visit(fn, this.name, 'name');
    visit(fn, this.pattern, 'pattern');
    visit(fn, this.initializer, 'initializer');
  }
}

export class ArrayPattern extends Node {
  constructor(elements, trailingComma) {
    super();
    this.elements = elements;
    this.trailingComma = trailingComma;
  }

  forEachChild(fn) {
    visit(fn, this.elements, 'elements');
  }
}

export class PatternElement extends Node {
  constructor(pattern, initializer) {
    super();
    this.pattern = pattern;
    this.initializer = initializer;
  }

  forEachChild(fn) {
    visit(fn, this.pattern, 'pattern');
    visit(fn, this.initializer, 'initializer');
  }
}

export class PatternRestElement extends Node {
  constructor(pattern) {
    super();
    this.pattern = pattern;
  }

  forEachChild(fn) {
    visit(fn, this.pattern, 'pattern');
  }
}

export class MethodDefinition extends Node {
  constructor(isStatic, kind, name, params, body) {
    super();
    this.static = isStatic;
    this.kind = kind;
    this.name = name;
    this.params = params;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.name, 'name');
    visit(fn, this.params, 'params');
    visit(fn, this.body, 'body');
  }
}

export class ArrayLiteral extends Node {
  constructor(elements, trailingComma) {
    super();
    this.elements = elements;
    this.trailingComma = trailingComma;
  }

  forEachChild(fn) {
    visit(fn, this.elements, 'elements');
  }
}

export class Block extends Node {
  constructor(statements) {
    super();
    this.statements = statements;
  }

  forEachChild(fn) {
    visit(fn, this.statements, 'statements');
  }
}

export class LabelledStatement extends Node {
  constructor(label, statement) {
    super();
    this.label = label;
    this.statement = statement;
  }

  forEachChild(fn) {
    visit(fn, this.label, 'label');
    visit(fn, this.statement, 'statement');
  }
}

export class ExpressionStatement extends Node {
  constructor(expression) {
    super();
    this.expression = expression;
  }

  forEachChild(fn) {
    visit(fn, this.expression, 'expression');
  }
}

export class Directive extends Node {
  constructor(value, expression) {
    super();
    this.value = value;
    this.expression = expression;
  }

  forEachChild(fn) {
    visit(fn, this.value, 'value');
    visit(fn, this.expression, 'expression');
  }
}

export class EmptyStatement extends Node {}

export class VariableDeclaration extends Node {
  constructor(kind, declarations) {
    super();
    this.kind = kind;
    this.declarations = declarations;
  }

  forEachChild(fn) {
    visit(fn, this.declarations, 'declarations');
  }
}

export class VariableDeclarator extends Node {
  constructor(pattern, initializer) {
    super();
    this.pattern = pattern;
    this.initializer = initializer;
  }

  forEachChild(fn) {
    visit(fn, this.pattern, 'pattern');
    visit(fn, this.initializer, 'initializer');
  }
}

export class ReturnStatement extends Node {
  constructor(argument) {
    super();
    this.argument = argument;
  }

  forEachChild(fn) {
    visit(fn, this.argument, 'argument');
  }
}

export class BreakStatement extends Node {
  constructor(label) {
    super();
    this.label = label;
  }

  forEachChild(fn) {
    visit(fn, this.label, 'label');
  }
}

export class ContinueStatement extends Node {
  constructor(label) {
    super();
    this.label = label;
  }

  forEachChild(fn) {
    visit(fn, this.label, 'label');
  }
}

export class ThrowStatement extends Node {
  constructor(expression) {
    super();
    this.expression = expression;
  }

  forEachChild(fn) {
    visit(fn, this.expression, 'expression');
  }
}

export class DebuggerStatement extends Node {}

export class IfStatement extends Node {
  constructor(test, consequent, alternate) {
    super();
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }

  forEachChild(fn) {
    visit(fn, this.test, 'test');
    visit(fn, this.consequent, 'consequent');
    visit(fn, this.alternate, 'alternate');
  }
}

export class DoWhileStatement extends Node {
  constructor(body, test) {
    super();
    this.body = body;
    this.test = test;
  }

  forEachChild(fn) {
    visit(fn, this.body, 'body');
    visit(fn, this.test, 'test');
  }
}

export class WhileStatement extends Node {
  constructor(test, body) {
    super();
    this.test = test;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.test, 'test');
    visit(fn, this.body, 'body');
  }
}

export class ForStatement extends Node {
  constructor(initializer, test, update, body) {
    super();
    this.initializer = initializer;
    this.test = test;
    this.update = update;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.initializer, 'initializer');
    visit(fn, this.test, 'test');
    visit(fn, this.update, 'update');
    visit(fn, this.body, 'body');
  }
}

export class ForInStatement extends Node {
  constructor(left, right, body) {
    super();
    this.left = left;
    this.right = right;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.left, 'left');
    visit(fn, this.right, 'right');
    visit(fn, this.body, 'body');
  }
}

export class ForOfStatement extends Node {
  constructor(async, left, right, body) {
    super();
    this.async = async;
    this.left = left;
    this.right = right;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.left, 'left');
    visit(fn, this.right, 'right');
    visit(fn, this.body, 'body');
  }
}

export class WithStatement extends Node {
  constructor(object, body) {
    super();
    this.object = object;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.object, 'object');
    visit(fn, this.body, 'body');
  }
}

export class SwitchStatement extends Node {
  constructor(descriminant, cases) {
    super();
    this.descriminant = descriminant;
    this.cases = cases;
  }

  forEachChild(fn) {
    visit(fn, this.descriminant, 'descriminant');
    visit(fn, this.cases, 'cases');
  }
}

export class SwitchCase extends Node {
  constructor(test, consequent) {
    super();
    this.test = test;
    this.consequent = consequent;
  }

  forEachChild(fn) {
    visit(fn, this.test, 'test');
    visit(fn, this.consequent, 'consequent');
  }
}

export class TryStatement extends Node {
  constructor(block, handler, finalizer) {
    super();
    this.block = block;
    this.handler = handler;
    this.finalizer = finalizer;
  }

  forEachChild(fn) {
    visit(fn, this.block, 'block');
    visit(fn, this.handler, 'handler');
    visit(fn, this.finalizer, 'finalizer');
  }
}

export class CatchClause extends Node {
  constructor(param, body) {
    super();
    this.param = param;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.param, 'param');
    visit(fn, this.body, 'body');
  }
}

export class FunctionDeclaration extends Node {
  constructor(kind, identifier, params, body) {
    super();
    this.kind = kind;
    this.identifier = identifier;
    this.params = params;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.identifier, 'identifier');
    visit(fn, this.params, 'params');
    visit(fn, this.body, 'body');
  }
}

export class FunctionExpression extends Node {
  constructor(kind, identifier, params, body) {
    super();
    this.kind = kind;
    this.identifier = identifier;
    this.params = params;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.identifier, 'identifier');
    visit(fn, this.params, 'params');
    visit(fn, this.body, 'body');
  }
}

export class FormalParameter extends Node {
  constructor(pattern, initializer) {
    super();
    this.pattern = pattern;
    this.initializer = initializer;
  }

  forEachChild(fn) {
    visit(fn, this.pattern, 'pattern');
    visit(fn, this.initializer, 'initializer');
  }
}

export class RestParameter extends Node {
  constructor(identifier) {
    super();
    this.identifier = identifier;
  }

  forEachChild(fn) {
    visit(fn, this.identifier, 'identifier');
  }
}

export class FunctionBody extends Node {
  constructor(statements) {
    super();
    this.statements = statements;
  }

  forEachChild(fn) {
    visit(fn, this.statements, 'statements');
  }
}

export class ArrowFunctionHead extends Node {
  constructor(params) {
    super();
    this.params = params;
  }

  forEachChild(fn) {
    visit(fn, this.params, 'params');
  }
}

export class ArrowFunction extends Node {
  constructor(kind, params, body) {
    super();
    this.kind = kind;
    this.params = params;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.params, 'params');
    visit(fn, this.body, 'body');
  }
}

export class ClassDeclaration extends Node {
  constructor(identifier, base, mixins, body) {
    super();
    this.identifier = identifier;
    this.base = base;
    this.mixins = mixins;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.identifier, 'identifier');
    visit(fn, this.base, 'base');
    visit(fn, this.mixins, 'mixins');
    visit(fn, this.body, 'body');
  }
}

export class ClassExpression extends Node {
  constructor(identifier, base, mixins, body) {
    super();
    this.identifier = identifier;
    this.base = base;
    this.mixins = mixins;
    this.body = body;
  }

  forEachChild(fn) {
    visit(fn, this.identifier, 'identifier');
    visit(fn, this.base, 'base');
    visit(fn, this.mixins, 'mixins');
    visit(fn, this.body, 'body');
  }
}

export class ClassBody extends Node {
  constructor(elements) {
    super();
    this.elements = elements;
  }

  forEachChild(fn) {
    visit(fn, this.elements, 'elements');
  }
}

export class EmptyClassElement extends Node {}

export class ClassField extends Node {
  constructor(isStatic, name, initializer) {
    super();
    this.static = isStatic;
    this.name = name;
    this.initializer = initializer;
  }

  forEachChild(fn) {
    visit(fn, this.name, 'name');
    visit(fn, this.initializer, 'initializer');
  }
}

export class ClassInitializer extends Node {
  constructor(statements) {
    super();
    this.statements = statements;
  }

  forEachChild(fn) {
    visit(fn, this.statements, 'statements');
  }
}

export class ImportCall extends Node {
  constructor(argument) {
    super();
    this.argument = argument;
  }

  forEachChild(fn) {
    visit(fn, this.argument, 'argument');
  }
}

export class ImportDeclaration extends Node {
  constructor(imports, from) {
    super();
    this.imports = imports;
    this.from = from;
  }

  forEachChild(fn) {
    visit(fn, this.imports, 'imports');
    visit(fn, this.from, 'from');
  }
}

export class NamespaceImport extends Node {
  constructor(identifier) {
    super();
    this.identifier = identifier;
  }

  forEachChild(fn) {
    visit(fn, this.identifier, 'identifier');
  }
}

export class NamedImports extends Node {
  constructor(specifiers) {
    super();
    this.specifiers = specifiers;
  }

  forEachChild(fn) {
    visit(fn, this.specifiers, 'specifiers');
  }
}

export class DefaultImport extends Node {
  constructor(identifier, imports) {
    super();
    this.identifier = identifier;
    this.imports = imports;
  }

  forEachChild(fn) {
    visit(fn, this.identifier, 'identifier');
    visit(fn, this.imports, 'imports');
  }
}

export class ImportSpecifier extends Node {
  constructor(imported, local) {
    super();
    this.imported = imported;
    this.local = local;
  }

  forEachChild(fn) {
    visit(fn, this.imported, 'imported');
    visit(fn, this.local, 'local');
  }
}

export class ExportDeclaration extends Node {
  constructor(declaration) {
    super();
    this.declaration = declaration;
  }

  forEachChild(fn) {
    visit(fn, this.declaration, 'declaration');
  }
}

export class ExportDefault extends Node {
  constructor(binding) {
    super();
    this.binding = binding;
  }

  forEachChild(fn) {
    visit(fn, this.binding, 'binding');
  }
}

export class ExportNameList extends Node {
  constructor(specifiers, from) {
    super();
    this.specifiers = specifiers;
    this.from = from;
  }

  forEachChild(fn) {
    visit(fn, this.specifiers, 'specifiers');
    visit(fn, this.from, 'from');
  }
}

export class ExportNamespace extends Node {
  constructor(identifier, from) {
    super();
    this.identifier = identifier;
    this.from = from;
  }

  forEachChild(fn) {
    visit(fn, this.identifier, 'identifier');
    visit(fn, this.from, 'from');
  }
}

export class ExportDefaultFrom extends Node {
  constructor(identifier, from) {
    super();
    this.identifier = identifier;
    this.from = from;
  }

  forEachChild(fn) {
    visit(fn, this.identifier, 'identifier');
    visit(fn, this.from, 'from');
  }
}

export class ExportSpecifier extends Node {
  constructor(local, exported) {
    super();
    this.local = local;
    this.exported = exported;
  }

  forEachChild(fn) {
    visit(fn, this.local, 'local');
    visit(fn, this.exported, 'exported');
  }
}

export class Comment extends Node {
  constructor(text) {
    super();
    this.text = text;
  }
}

export class Annotation extends Node {
  constructor(expressions) {
    super();
    this.expressions = expressions;
  }

  forEachChild(n) {
    visit(n, this.expressions, 'expressions');
  }
}
