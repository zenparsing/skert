export { forEachChild } from './Visitor.js';

function init(node, type) {
  node.type = type;
  node.start = -1;
  node.end = -1;
}

export function Identifier(value, context) {
  init(this, 'Identifier');
  this.value = value; // value
  this.context = context; // value
}

export function NumberLiteral(value, suffix) {
  init(this, 'NumberLiteral');
  this.value = value; // value
  this.suffix = suffix; // value
}

export function StringLiteral(value) {
  init(this, 'StringLiteral');
  this.value = value; // value
}

export function TemplatePart(value, raw, isEnd) {
  init(this, 'TemplatePart');
  this.value = value; // value
  this.raw = raw; // value
  this.templateEnd = isEnd; // value
}

export function RegularExpression(value, flags) {
  init(this, 'RegularExpression');
  this.value = value; // value
  this.flags = flags; // value
}

export function BooleanLiteral(value) {
  init(this, 'BooleanLiteral');
  this.value = value; // value
}

export function NullLiteral() {
  init(this, 'NullLiteral');
}

export function SymbolName(value) {
  init(this, 'SymbolName');
  this.value = value; // value
}

export function ThisExpression() {
  init(this, 'ThisExpression');
}

export function SuperKeyword() {
  init(this, 'SuperKeyword');
}

export function MetaProperty(left, right) {
  init(this, 'MetaProperty');
  this.left = left; // value
  this.right = right; // value
}

export function Script(statements) {
  init(this, 'Script');
  this.statements = statements; // list
}

export function Module(statements) {
  init(this, 'Module');
  this.statements = statements; // list
}

export function SequenceExpression(expressions) {
  init(this, 'SequenceExpression');
  this.expressions = expressions; // list
}

export function AssignmentExpression(left, op, right) {
  init(this, 'AssignmentExpression');
  this.left = left;
  this.operator = op; // value
  this.right = right;
}

export function SpreadExpression(expr) {
  init(this, 'SpreadExpression');
  this.expression = expr;
}

export function YieldExpression(delegate, expr) {
  init(this, 'YieldExpression');
  this.delegate = delegate; // value
  this.expression = expr;
}

export function ConditionalExpression(test, cons, alt) {
  init(this, 'ConditionalExpression');
  this.test = test;
  this.consequent = cons;
  this.alternate = alt;
}

export function BinaryExpression(left, op, right) {
  init(this, 'BinaryExpression');
  this.left = left;
  this.operator = op; // value
  this.right = right;
}

export function UpdateExpression(op, expr, prefix) {
  init(this, 'UpdateExpression');
  this.operator = op; // value
  this.expression = expr;
  this.prefix = prefix; // value
}

export function UnaryExpression(op, expr) {
  init(this, 'UnaryExpression');
  this.operator = op; // value
  this.expression = expr;
}

export function MemberExpression(obj, prop) {
  init(this, 'MemberExpression');
  this.object = obj;
  this.property = prop;
}

export function CallExpression(callee, args, trailingComma) {
  init(this, 'CallExpression');
  this.callee = callee;
  this.arguments = args; // list
  this.trailingComma = trailingComma; // value
}

export function CallWithExpression(subject, callee, args, trailingComma) {
  init(this, 'CallWithExpression');
  this.subject = subject;
  this.callee = callee;
  this.arguments = args; // list
  this.trailingComma = trailingComma; // value
}

export function TemplateExpression(parts) {
  init(this, 'TemplateExpression');
  this.parts = parts; // list
}

export function TaggedTemplateExpression(tag, template) {
  init(this, 'TaggedTemplateExpression');
  this.tag = tag;
  this.template = template;
}

export function NewExpression(callee, args, trailingComma) {
  init(this, 'NewExpression');
  this.callee = callee;
  this.arguments = args; // list
  this.trailingComma = trailingComma; // value
}

export function ParenExpression(expr) {
  init(this, 'ParenExpression');
  this.expression = expr;
}

export function ObjectLiteral(props, trailingComma) {
  init(this, 'ObjectLiteral');
  this.properties = props; // list
  this.trailingComma = trailingComma; // value
}

export function ComputedPropertyName(expr) {
  init(this, 'ComputedPropertyName');
  this.expression = expr;
}

export function PropertyDefinition(name, expr) {
  init(this, 'PropertyDefinition');
  this.name = name;
  this.expression = expr;
}

export function ObjectPattern(props, trailingComma) {
  init(this, 'ObjectPattern');
  this.properties = props; // list
  this.trailingComma = trailingComma; // value
}

export function PatternProperty(name, pattern, initializer) {
  init(this, 'PatternProperty');
  this.name = name;
  this.pattern = pattern;
  this.initializer = initializer;
}

export function ArrayPattern(elements, trailingComma) {
  init(this, 'ArrayPattern');
  this.elements = elements; // list
  this.trailingComma = trailingComma; // value
}

export function PatternElement(pattern, initializer) {
  init(this, 'PatternElement');
  this.pattern = pattern;
  this.initializer = initializer;
}

export function PatternRestElement(pattern) {
  init(this, 'PatternRestElement');
  this.pattern = pattern;
}

export function MethodDefinition(isStatic, kind, name, params, body) {
  init(this, 'MethodDefinition');
  this.static = isStatic; // value
  this.kind = kind; // value
  this.name = name;
  this.params = params; // list
  this.body = body;
}

export function ArrayLiteral(elements, trailingComma) {
  init(this, 'ArrayLiteral');
  this.elements = elements; // list
  this.trailingComma = trailingComma; // value
}

export function Block(statements) {
  init(this, 'Block');
  this.statements = statements; // list
}

export function LabelledStatement(label, statement) {
  init(this, 'LabelledStatement');
  this.label = label;
  this.statement = statement;
}

export function ExpressionStatement(expr) {
  init(this, 'ExpressionStatement');
  this.expression = expr;
}

export function Directive(value, expr) {
  init(this, 'Directive');
  this.value = value; // value
  this.expression = expr;
}

export function EmptyStatement() {
  init(this, 'EmptyStatement');
}

export function VariableDeclaration(kind, declarations) {
  init(this, 'VariableDeclaration');
  this.kind = kind; // value
  this.declarations = declarations; // list
}

export function VariableDeclarator(pattern, initializer) {
  init(this, 'VariableDeclarator');
  this.pattern = pattern;
  this.initializer = initializer;
}

export function ReturnStatement(arg) {
  init(this, 'ReturnStatement');
  this.argument = arg;
}

export function BreakStatement(label) {
  init(this, 'BreakStatement');
  this.label = label;
}

export function ContinueStatement(label) {
  init(this, 'ContinueStatement');
  this.label = label;
}

export function ThrowStatement(expr) {
  init(this, 'ThrowStatement');
  this.expression = expr;
}

export function DebuggerStatement() {
  init(this, 'DebuggerStatement');
}

export function IfStatement(test, cons, alt) {
  init(this, 'IfStatement');
  this.test = test;
  this.consequent = cons;
  this.alternate = alt;
}

export function DoWhileStatement(body, test) {
  init(this, 'DoWhileStatement');
  this.body = body;
  this.test = test;
}

export function WhileStatement(test, body) {
  init(this, 'WhileStatement');
  this.test = test;
  this.body = body;
}

export function ForStatement(initializer, test, update, body) {
  init(this, 'ForStatement');
  this.initializer = initializer;
  this.test = test;
  this.update = update;
  this.body = body;
}

export function ForInStatement(left, right, body) {
  init(this, 'ForInStatement');
  this.left = left;
  this.right = right;
  this.body = body;
}

export function ForOfStatement(async, left, right, body) {
  init(this, 'ForOfStatement');
  this.async = async; // value
  this.left = left;
  this.right = right;
  this.body = body;
}

export function WithStatement(object, body) {
  init(this, 'WithStatement');
  this.object = object;
  this.body = body;
}

export function SwitchStatement(desc, cases) {
  init(this, 'SwitchStatement');
  this.descriminant = desc;
  this.cases = cases; // list
}

export function SwitchCase(test, statements) {
  init(this, 'SwitchCase');
  this.test = test;
  this.statements = statements; // list
}

export function TryStatement(block, handler, fin) {
  init(this, 'TryStatement');
  this.block = block;
  this.handler = handler;
  this.finalizer = fin;
}

export function CatchClause(param, body) {
  init(this, 'CatchClause');
  this.param = param;
  this.body = body;
}

export function FunctionDeclaration(kind, identifier, params, body) {
  init(this, 'FunctionDeclaration');
  this.kind = kind; // value
  this.identifier = identifier;
  this.params = params; // list
  this.body = body;
}

export function FunctionExpression(kind, identifier, params, body) {
  init(this, 'FunctionExpression');
  this.kind = kind; // value
  this.identifier = identifier;
  this.params = params; // list
  this.body = body;
}

export function FormalParameter(pattern, initializer) {
  init(this, 'FormalParameter');
  this.pattern = pattern;
  this.initializer = initializer;
}

export function RestParameter(identifier) {
  init(this, 'RestParameter');
  this.identifier = identifier;
}

export function FunctionBody(statements) {
  init(this, 'FunctionBody');
  this.statements = statements; // list
}

export function ArrowFunctionHead(params) {
  init(this, 'ArrowFunctionHead');
  this.params = params; // list
}

export function ArrowFunction(kind, params, body) {
  init(this, 'ArrowFunction');
  this.kind = kind; // value
  this.params = params; // list
  this.body = body;
}

export function ClassDeclaration(identifier, base, mixins, body) {
  init(this, 'ClassDeclaration');
  this.identifier = identifier;
  this.base = base;
  this.mixins = mixins; // list
  this.body = body;
}

export function ClassExpression(identifier, base, mixins, body) {
  init(this, 'ClassExpression');
  this.identifier = identifier;
  this.base = base;
  this.mixins = mixins; // list
  this.body = body;
}

export function ClassBody(elements) {
  init(this, 'ClassBody');
  this.elements = elements; // list
}

export function EmptyClassElement() {
  init(this, 'EmptyClassElement');
}

export function ClassField(isStatic, name, initializer) {
  init(this, 'ClassField');
  this.static = isStatic; // value
  this.name = name;
  this.initializer = initializer;
}

export function ClassInitializer(statements) {
  init(this, 'ClassInitializer');
  this.statements = statements; // list
}

export function ImportCall(argument) {
  init(this, 'ImportCall');
  this.argument = argument;
}

export function ImportDeclaration(imports, from) {
  init(this, 'ImportDeclaration');
  this.imports = imports;
  this.from = from;
}

export function NamespaceImport(identifier) {
  init(this, 'NamespaceImport');
  this.identifier = identifier;
}

export function NamedImports(specifiers) {
  init(this, 'NamedImports');
  this.specifiers = specifiers; // list
}

export function DefaultImport(identifier, imports) {
  init(this, 'DefaultImport');
  this.identifier = identifier;
  this.imports = imports;
}

export function ImportSpecifier(imported, local) {
  init(this, 'ImportSpecifier');
  this.imported = imported;
  this.local = local;
}

export function ExportDeclaration(declaration) {
  init(this, 'ExportDeclaration');
  this.declaration = declaration;
}

export function ExportDefault(binding) {
  init(this, 'ExportDefault');
  this.binding = binding;
}

export function ExportNameList(specifiers, from) {
  init(this, 'ExportNameList');
  this.specifiers = specifiers; // list
  this.from = from;
}

export function ExportNamespace(identifier, from) {
  init(this, 'ExportNamespace');
  this.identifier = identifier;
  this.from = from;
}

export function ExportDefaultFrom(identifier, from) {
  init(this, 'ExportDefaultFrom');
  this.identifier = identifier;
  this.from = from;
}

export function ExportSpecifier(local, exported) {
  init(this, 'ExportSpecifier');
  this.local = local;
  this.exported = exported;
}

export function Comment(text) {
  init(this, 'Comment');
  this.text = text; // value
}

export function Annotation(expressions) {
  init(this, 'Annotation');
  this.expressions = expressions; // list
}
