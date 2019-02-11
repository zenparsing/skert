function v(key, value, fn) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      fn(value[i], key, i);
    }
  } else if (value) {
    fn(value, key);
  }
}

class ChildVisitor {

  Identifier() {}

  NumberLiteral() {}

  StringLiteral() {}

  TemplatePart() {}

  RegularExpression() {}

  BooleanLiteral() {}

  NullLiteral() {}

  SymbolName() {}

  ThisExpression() {}

  SuperKeyword() {}

  MetaProperty() {}

  Script(node, fn) {
    v('statements', node.statements, fn);
  }

  Module(node, fn) {
    v('statements', node.statements, fn);
  }

  SequenceExpression(node, fn) {
    v('expressions', node.expressions, fn);
  }

  AssignmentExpression(node, fn) {
    v('left', node.left, fn);
    v('right', node.right, fn);
  }

  SpreadExpression(node, fn) {
    v('expression', node.expression, fn);
  }

  YieldExpression(node, fn) {
    v('expression', node.expression, fn);
  }

  ConditionalExpression(node, fn) {
    v('test', node.test, fn);
    v('consequent', node.consequent, fn);
    v('alternate', node.alternate, fn);
  }

  BinaryExpression(node, fn) {
    v('left', node.left, fn);
    v('right', node.right, fn);
  }

  UpdateExpression(node, fn) {
    v('expression', node.expression, fn);
  }

  UnaryExpression(node, fn) {
    v('expression', node.expression, fn);
  }

  MemberExpression(node, fn) {
    v('object', node.object, fn);
    v('property', node.property, fn);
  }

  CallExpression(node, fn) {
    v('callee', node.callee, fn);
    v('arguments', node.arguments, fn);
  }

  CallWithExpression(node, fn) {
    v('subject', node.subject, fn);
    v('callee', node.callee, fn);
    v('arguments', node.arguments, fn);
  }

  TemplateExpression(node, fn) {
    v('parts', node.parts, fn);
  }

  TaggedTemplateExpression(node, fn) {
    v('tag', node.tag, fn);
    v('template', node.template, fn);
  }

  NewExpression(node, fn) {
    v('callee', node.callee, fn);
    v('arguments', node.arguments, fn);
  }

  ParenExpression(node, fn) {
    v('expression', node.expression, fn);
  }

  ObjectLiteral(node, fn) {
    v('properties', node.properties, fn);
  }

  ComputedPropertyName(node, fn) {
    v('expression', node.expression, fn);
  }

  PropertyDefinition(node, fn) {
    v('name', node.name, fn);
    v('expression', node.expression, fn);
  }

  ObjectPattern(node, fn) {
    v('properties', node.properties, fn);
  }

  PatternProperty(node, fn) {
    v('name', node.name, fn);
    v('pattern', node.pattern, fn);
    v('initializer', node.initializer, fn);
  }

  ArrayPattern(node, fn) {
    v('elements', node.elements, fn);
  }

  PatternElement(node, fn) {
    v('pattern', node.pattern, fn);
    v('initializer', node.initializer, fn);
  }

  PatternRestElement(node, fn) {
    v('pattern', node.pattern, fn);
  }

  MethodDefinition(node, fn) {
    v('name', node.name, fn);
    v('params', node.params, fn);
    v('body', node.body, fn);
  }

  ArrayLiteral(node, fn) {
    v('elements', node.elements, fn);
  }

  Block(node, fn) {
    v('statements', node.statements, fn);
  }

  LabelledStatement(node, fn) {
    v('label', node.label, fn);
    v('statement', node.statement, fn);
  }

  ExpressionStatement(node, fn) {
    v('expression', node.expression, fn);
  }

  Directive(node, fn) {
    v('expression', node.expression, fn);
  }

  EmptyStatement() {}

  VariableDeclaration(node, fn) {
    v('declarations', node.declarations, fn);
  }

  VariableDeclarator(node, fn) {
    v('pattern', node.pattern, fn);
    v('initializer', node.initializer, fn);
  }

  ReturnStatement(node, fn) {
    v('argument', node.argument, fn);
  }

  BreakStatement(node, fn) {
    v('label', node.label, fn);
  }

  ContinueStatement(node, fn) {
    v('label', node.label, fn);
  }

  ThrowStatement(node, fn) {
    v('expression', node.expression, fn);
  }

  DebuggerStatement() {}

  IfStatement(node, fn) {
    v('test', node.test, fn);
    v('consequent', node.consequent, fn);
    v('alternate', node.alternate, fn);
  }

  DoWhileStatement(node, fn) {
    v('body', node.body, fn);
    v('test', node.test, fn);
  }

  WhileStatement(node, fn) {
    v('test', node.test, fn);
    v('body', node.body, fn);
  }

  ForStatement(node, fn) {
    v('initializer', node.initializer, fn);
    v('test', node.test, fn);
    v('update', node.update, fn);
    v('body', node.body, fn);
  }

  ForInStatement(node, fn) {
    v('left', node.left, fn);
    v('right', node.right, fn);
    v('body', node.body, fn);
  }

  ForOfStatement(node, fn) {
    v('left', node.left, fn);
    v('right', node.right, fn);
    v('body', node.body, fn);
  }

  WithStatement(node, fn) {
    v('object', node.object, fn);
    v('body', node.body, fn);
  }

  SwitchStatement(node, fn) {
    v('descriminant', node.descriminant, fn);
    v('cases', node.cases, fn);
  }

  SwitchCase(node, fn) {
    v('test', node.test, fn);
    v('consequent', node.consequent, fn);
  }

  TryStatement(node, fn) {
    v('block', node.block, fn);
    v('handler', node.handler, fn);
    v('finalizer', node.finalizer, fn);
  }

  CatchClause(node, fn) {
    v('param', node.param, fn);
    v('body', node.body, fn);
  }

  FunctionDeclaration(node, fn) {
    v('identifier', node.identifier, fn);
    v('params', node.params, fn);
    v('body', node.body, fn);
  }

  FunctionExpression(node, fn) {
    v('identifier', node.identifier, fn);
    v('params', node.params, fn);
    v('body', node.body, fn);
  }

  FormalParameter(node, fn) {
    v('pattern', node.pattern, fn);
    v('initializer', node.initializer, fn);
  }

  RestParameter(node, fn) {
    v('identifier', node.identifier, fn);
  }

  FunctionBody(node, fn) {
    v('statements', node.statements, fn);
  }

  ArrowFunctionHead(node, fn) {
    v('params', node.params, fn);
  }

  ArrowFunction(node, fn) {
    v('params', node.params, fn);
    v('body', node.body, fn);
  }

  ClassDeclaration(node, fn) {
    v('identifier', node.identifier, fn);
    v('base', node.base, fn);
    v('mixins', node.mixins, fn);
    v('body', node.body, fn);
  }

  ClassExpression(node, fn) {
    v('identifier', node.identifier, fn);
    v('base', node.base, fn);
    v('mixins', node.mixins, fn);
    v('body', node.body, fn);
  }

  ClassBody(node, fn) {
    v('elements', node.elements, fn);
  }

  EmptyClassElement() {}

  ClassField(node, fn) {
    v('name', node.name, fn);
    v('initializer', node.initializer, fn);
  }

  ClassInitializer(node, fn) {
    v('statements', node.statements, fn);
  }

  ImportCall(node, fn) {
    v('argument', node.argument, fn);
  }

  ImportDeclaration(node, fn) {
    v('imports', node.imports, fn);
    v('from', node.from, fn);
  }

  NamespaceImport(node, fn) {
    v('identifier', node.identifier, fn);
  }

  NamedImports(node, fn) {
    v('specifiers', node.specifiers, fn);
  }

  DefaultImport(node, fn) {
    v('identifier', node.identifier, fn);
    v('imports', node.imports, fn);
  }

  ImportSpecifier(node, fn) {
    v('imported', node.imported, fn);
    v('local', node.local, fn);
  }

  ExportDeclaration(node, fn) {
    v('declaration', node.declaration, fn);
  }

  ExportDefault(node, fn) {
    v('binding', node.binding, fn);
  }

  ExportNameList(node, fn) {
    v('specifiers', node.specifiers, fn);
    v('from', node.from, fn);
  }

  ExportNamespace(node, fn) {
    v('identifier', node.identifier, fn);
    v('from', node.from, fn);
  }

  ExportDefaultFrom(node, fn) {
    v('identifier', node.identifier, fn);
    v('from', node.from, fn);
  }

  ExportSpecifier(node, fn) {
    v('local', node.local, fn);
    v('exported', node.exported, fn);
  }

  Comment() {}

  Annotation(node, fn) {
    v('expressions', node.expressions, fn);
  }

}

const childVisitor = new ChildVisitor();

export function forEachChild(node, fn) {
  childVisitor[node.type](node, fn);
}
