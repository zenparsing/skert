function visit(key, value, fn) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      fn(value[i], key, i);
    }
  } else if (value) {
    fn(value, key);
  }
}

const visitor = {

  Identifier() {},

  NumberLiteral() {},

  StringLiteral() {},

  TemplatePart() {},

  RegularExpression() {},

  BooleanLiteral() {},

  NullLiteral() {},

  SymbolName() {},

  ThisExpression() {},

  SuperKeyword() {},

  MetaProperty() {},

  Script(node, fn) {
    visit('statements', node.statements, fn);
  },

  Module(node, fn) {
    visit('statements', node.statements, fn);
  },

  SequenceExpression(node, fn) {
    visit('expressions', node.expressions, fn);
  },

  AssignmentExpression(node, fn) {
    visit('left', node.left, fn);
    visit('right', node.right, fn);
  },

  SpreadExpression(node, fn) {
    visit('expression', node.expression, fn);
  },

  YieldExpression(node, fn) {
    visit('expression', node.expression, fn);
  },

  ConditionalExpression(node, fn) {
    visit('test', node.test, fn);
    visit('consequent', node.consequent, fn);
    visit('alternate', node.alternate, fn);
  },

  BinaryExpression(node, fn) {
    visit('left', node.left, fn);
    visit('right', node.right, fn);
  },

  UpdateExpression(node, fn) {
    visit('expression', node.expression, fn);
  },

  UnaryExpression(node, fn) {
    visit('expression', node.expression, fn);
  },

  MemberExpression(node, fn) {
    visit('object', node.object, fn);
    visit('property', node.property, fn);
  },

  CallExpression(node, fn) {
    visit('callee', node.callee, fn);
    visit('arguments', node.arguments, fn);
  },

  CallWithExpression(node, fn) {
    visit('subject', node.subject, fn);
    visit('callee', node.callee, fn);
    visit('arguments', node.arguments, fn);
  },

  TemplateExpression(node, fn) {
    visit('parts', node.parts, fn);
  },

  TaggedTemplateExpression(node, fn) {
    visit('tag', node.tag, fn);
    visit('template', node.template, fn);
  },

  NewExpression(node, fn) {
    visit('callee', node.callee, fn);
    visit('arguments', node.arguments, fn);
  },

  ParenExpression(node, fn) {
    visit('expression', node.expression, fn);
  },

  ObjectLiteral(node, fn) {
    visit('properties', node.properties, fn);
  },

  ComputedPropertyName(node, fn) {
    visit('expression', node.expression, fn);
  },

  PropertyDefinition(node, fn) {
    visit('name', node.name, fn);
    visit('expression', node.expression, fn);
  },

  ObjectPattern(node, fn) {
    visit('properties', node.properties, fn);
  },

  PatternProperty(node, fn) {
    visit('name', node.name, fn);
    visit('pattern', node.pattern, fn);
    visit('initializer', node.initializer, fn);
  },

  ArrayPattern(node, fn) {
    visit('elements', node.elements, fn);
  },

  PatternElement(node, fn) {
    visit('pattern', node.pattern, fn);
    visit('initializer', node.initializer, fn);
  },

  PatternRestElement(node, fn) {
    visit('pattern', node.pattern, fn);
  },

  MethodDefinition(node, fn) {
    visit('name', node.name, fn);
    visit('params', node.params, fn);
    visit('body', node.body, fn);
  },

  ArrayLiteral(node, fn) {
    visit('elements', node.elements, fn);
  },

  Block(node, fn) {
    visit('statements', node.statements, fn);
  },

  LabelledStatement(node, fn) {
    visit('label', node.label, fn);
    visit('statement', node.statement, fn);
  },

  ExpressionStatement(node, fn) {
    visit('expression', node.expression, fn);
  },

  Directive(node, fn) {
    visit('expression', node.expression, fn);
  },

  EmptyStatement() {},

  VariableDeclaration(node, fn) {
    visit('declarations', node.declarations, fn);
  },

  VariableDeclarator(node, fn) {
    visit('pattern', node.pattern, fn);
    visit('initializer', node.initializer, fn);
  },

  ReturnStatement(node, fn) {
    visit('argument', node.argument, fn);
  },

  BreakStatement(node, fn) {
    visit('label', node.label, fn);
  },

  ContinueStatement(node, fn) {
    visit('label', node.label, fn);
  },

  ThrowStatement(node, fn) {
    visit('expression', node.expression, fn);
  },

  DebuggerStatement() {},

  IfStatement(node, fn) {
    visit('test', node.test, fn);
    visit('consequent', node.consequent, fn);
    visit('alternate', node.alternate, fn);
  },

  DoWhileStatement(node, fn) {
    visit('body', node.body, fn);
    visit('test', node.test, fn);
  },

  WhileStatement(node, fn) {
    visit('test', node.test, fn);
    visit('body', node.body, fn);
  },

  ForStatement(node, fn) {
    visit('initializer', node.initializer, fn);
    visit('test', node.test, fn);
    visit('update', node.update, fn);
    visit('body', node.body, fn);
  },

  ForInStatement(node, fn) {
    visit('left', node.left, fn);
    visit('right', node.right, fn);
    visit('body', node.body, fn);
  },

  ForOfStatement(node, fn) {
    visit('left', node.left, fn);
    visit('right', node.right, fn);
    visit('body', node.body, fn);
  },

  WithStatement(node, fn) {
    visit('object', node.object, fn);
    visit('body', node.body, fn);
  },

  SwitchStatement(node, fn) {
    visit('descriminant', node.descriminant, fn);
    visit('cases', node.cases, fn);
  },

  SwitchCase(node, fn) {
    visit('test', node.test, fn);
    visit('consequent', node.consequent, fn);
  },

  TryStatement(node, fn) {
    visit('block', node.block, fn);
    visit('handler', node.handler, fn);
    visit('finalizer', node.finalizer, fn);
  },

  CatchClause(node, fn) {
    visit('param', node.param, fn);
    visit('body', node.body, fn);
  },

  FunctionDeclaration(node, fn) {
    visit('identifier', node.identifier, fn);
    visit('params', node.params, fn);
    visit('body', node.body, fn);
  },

  FunctionExpression(node, fn) {
    visit('identifier', node.identifier, fn);
    visit('params', node.params, fn);
    visit('body', node.body, fn);
  },

  FormalParameter(node, fn) {
    visit('pattern', node.pattern, fn);
    visit('initializer', node.initializer, fn);
  },

  RestParameter(node, fn) {
    visit('identifier', node.identifier, fn);
  },

  FunctionBody(node, fn) {
    visit('statements', node.statements, fn);
  },

  ArrowFunctionHead(node, fn) {
    visit('params', node.params, fn);
  },

  ArrowFunction(node, fn) {
    visit('params', node.params, fn);
    visit('body', node.body, fn);
  },

  ClassDeclaration(node, fn) {
    visit('identifier', node.identifier, fn);
    visit('base', node.base, fn);
    visit('mixins', node.mixins, fn);
    visit('body', node.body, fn);
  },

  ClassExpression(node, fn) {
    visit('identifier', node.identifier, fn);
    visit('base', node.base, fn);
    visit('mixins', node.mixins, fn);
    visit('body', node.body, fn);
  },

  ClassBody(node, fn) {
    visit('elements', node.elements, fn);
  },

  EmptyClassElement() {},

  ClassField(node, fn) {
    visit('name', node.name, fn);
    visit('initializer', node.initializer, fn);
  },

  ClassInitializer(node, fn) {
    visit('statements', node.statements, fn);
  },

  ImportCall(node, fn) {
    visit('argument', node.argument, fn);
  },

  ImportDeclaration(node, fn) {
    visit('imports', node.imports, fn);
    visit('from', node.from, fn);
  },

  NamespaceImport(node, fn) {
    visit('identifier', node.identifier, fn);
  },

  NamedImports(node, fn) {
    visit('specifiers', node.specifiers, fn);
  },

  DefaultImport(node, fn) {
    visit('identifier', node.identifier, fn);
    visit('imports', node.imports, fn);
  },

  ImportSpecifier(node, fn) {
    visit('imported', node.imported, fn);
    visit('local', node.local, fn);
  },

  ExportDeclaration(node, fn) {
    visit('declaration', node.declaration, fn);
  },

  ExportDefault(node, fn) {
    visit('binding', node.binding, fn);
  },

  ExportNameList(node, fn) {
    visit('specifiers', node.specifiers, fn);
    visit('from', node.from, fn);
  },

  ExportNamespace(node, fn) {
    visit('identifier', node.identifier, fn);
    visit('from', node.from, fn);
  },

  ExportDefaultFrom(node, fn) {
    visit('identifier', node.identifier, fn);
    visit('from', node.from, fn);
  },

  ExportSpecifier(node, fn) {
    visit('local', node.local, fn);
    visit('exported', node.exported, fn);
  },

  Comment() {},

  Annotation(node, fn) {
    visit('expressions', node.expressions, fn);
  },

};

export function forEachChild(node, fn) {
  visitor[node.type](node, fn);
}
