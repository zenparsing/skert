function list(value, key, fn) {
  if (value) {
    for (let i = 0; i < value.length; ++i) {
      fn(value[i], key, i);
    }
  }
}

function prop(value, key, fn) {
  if (value) {
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
    list(node.statements, 'statements', fn);
  }

  Module(node, fn) {
    list(node.statements, 'statements', fn);
  }

  SequenceExpression(node, fn) {
    list(node.expressions, 'expressions', fn);
  }

  AssignmentExpression(node, fn) {
    prop(node.left, 'left', fn);
    prop(node.right, 'right', fn);
  }

  SpreadExpression(node, fn) {
    prop(node.expression, 'expression', fn);
  }

  YieldExpression(node, fn) {
    prop(node.expression, 'expression', fn);
  }

  ConditionalExpression(node, fn) {
    prop(node.test, 'test', fn);
    prop(node.consequent, 'consequent', fn);
    prop(node.alternate, 'alternate', fn);
  }

  BinaryExpression(node, fn) {
    prop(node.left, 'left', fn);
    prop(node.right, 'right', fn);
  }

  UpdateExpression(node, fn) {
    prop(node.expression, 'expression', fn);
  }

  UnaryExpression(node, fn) {
    prop(node.expression, 'expression', fn);
  }

  MemberExpression(node, fn) {
    prop(node.object, 'object', fn);
    prop(node.property, 'property', fn);
  }

  CallExpression(node, fn) {
    prop(node.callee, 'callee', fn);
    list(node.arguments, 'arguments', fn);
  }

  CallWithExpression(node, fn) {
    prop(node.subject, 'subject', fn);
    prop(node.callee, 'callee', fn);
    list(node.arguments, 'arguments', fn);
  }

  TemplateExpression(node, fn) {
    list(node.parts, 'parts', fn);
  }

  TaggedTemplateExpression(node, fn) {
    prop(node.tag, 'tag', fn);
    prop(node.template, 'template', fn);
  }

  NewExpression(node, fn) {
    prop(node.callee, 'callee', fn);
    list(node.arguments, 'arguments', fn);
  }

  ParenExpression(node, fn) {
    prop(node.expression, 'expression', fn);
  }

  ObjectLiteral(node, fn) {
    list(node.properties, 'properties', fn);
  }

  ComputedPropertyName(node, fn) {
    prop(node.expression, 'expression', fn);
  }

  PropertyDefinition(node, fn) {
    prop(node.name, 'name', fn);
    prop(node.expression, 'expression', fn);
  }

  ObjectPattern(node, fn) {
    list(node.properties, 'properties', fn);
  }

  PatternProperty(node, fn) {
    prop(node.name, 'name', fn);
    prop(node.pattern, 'pattern', fn);
    prop(node.initializer, 'initializer', fn);
  }

  ArrayPattern(node, fn) {
    list(node.elements, 'elements', fn);
  }

  PatternElement(node, fn) {
    prop(node.pattern, 'pattern', fn);
    prop(node.initializer, 'initializer', fn);
  }

  PatternRestElement(node, fn) {
    prop(node.pattern, 'pattern', fn);
  }

  MethodDefinition(node, fn) {
    prop(node.name, 'name', fn);
    list(node.params, 'params', fn);
    prop(node.body, 'body', fn);
  }

  ArrayLiteral(node, fn) {
    list(node.elements, 'elements', fn);
  }

  Block(node, fn) {
    list(node.statements, 'statements', fn);
  }

  LabelledStatement(node, fn) {
    prop(node.label, 'label', fn);
    prop(node.statement, 'statement', fn);
  }

  ExpressionStatement(node, fn) {
    prop(node.expression, 'expression', fn);
  }

  Directive(node, fn) {
    prop(node.expression, 'expression', fn);
  }

  EmptyStatement() {}

  VariableDeclaration(node, fn) {
    list(node.declarations, 'declarations', fn);
  }

  VariableDeclarator(node, fn) {
    prop(node.pattern, 'pattern', fn);
    prop(node.initializer, 'initializer', fn);
  }

  ReturnStatement(node, fn) {
    prop(node.argument, 'argument', fn);
  }

  BreakStatement(node, fn) {
    prop(node.label, 'label', fn);
  }

  ContinueStatement(node, fn) {
    prop(node.label, 'label', fn);
  }

  ThrowStatement(node, fn) {
    prop(node.expression, 'expression', fn);
  }

  DebuggerStatement() {}

  IfStatement(node, fn) {
    prop(node.test, 'test', fn);
    prop(node.consequent, 'consequent', fn);
    prop(node.alternate, 'alternate', fn);
  }

  DoWhileStatement(node, fn) {
    prop(node.body, 'body', fn);
    prop(node.test, 'test', fn);
  }

  WhileStatement(node, fn) {
    prop(node.test, 'test', fn);
    prop(node.body, 'body', fn);
  }

  ForStatement(node, fn) {
    prop(node.initializer, 'initializer', fn);
    prop(node.test, 'test', fn);
    prop(node.update, 'update', fn);
    prop(node.body, 'body', fn);
  }

  ForInStatement(node, fn) {
    prop(node.left, 'left', fn);
    prop(node.right, 'right', fn);
    prop(node.body, 'body', fn);
  }

  ForOfStatement(node, fn) {
    prop(node.left, 'left', fn);
    prop(node.right, 'right', fn);
    prop(node.body, 'body', fn);
  }

  WithStatement(node, fn) {
    prop(node.object, 'object', fn);
    prop(node.body, 'body', fn);
  }

  SwitchStatement(node, fn) {
    prop(node.descriminant, 'descriminant', fn);
    list(node.cases, 'cases', fn);
  }

  SwitchCase(node, fn) {
    prop(node.test, 'test', fn);
    list(node.statements, 'statements', fn);
  }

  TryStatement(node, fn) {
    prop(node.block, 'block', fn);
    prop(node.handler, 'handler', fn);
    prop(node.finalizer, 'finalizer', fn);
  }

  CatchClause(node, fn) {
    prop(node.param, 'param', fn);
    prop(node.body, 'body', fn);
  }

  FunctionDeclaration(node, fn) {
    prop(node.identifier, 'identifier', fn);
    list(node.params, 'params', fn);
    prop(node.body, 'body', fn);
  }

  FunctionExpression(node, fn) {
    prop(node.identifier, 'identifier', fn);
    list(node.params, 'params', fn);
    prop(node.body, 'body', fn);
  }

  FormalParameter(node, fn) {
    prop(node.pattern, 'pattern', fn);
    prop(node.initializer, 'initializer', fn);
  }

  RestParameter(node, fn) {
    prop(node.identifier, 'identifier', fn);
  }

  FunctionBody(node, fn) {
    list(node.statements, 'statements', fn);
  }

  ArrowFunctionHead(node, fn) {
    list(node.params, 'params', fn);
  }

  ArrowFunction(node, fn) {
    list(node.params, 'params', fn);
    prop(node.body, 'body', fn);
  }

  ClassDeclaration(node, fn) {
    prop(node.identifier, 'identifier', fn);
    prop(node.base, 'base', fn);
    list(node.mixins, 'mixins', fn);
    prop(node.body, 'body', fn);
  }

  ClassExpression(node, fn) {
    prop(node.identifier, 'identifier', fn);
    prop(node.base, 'base', fn);
    list(node.mixins, 'mixins', fn);
    prop(node.body, 'body', fn);
  }

  ClassBody(node, fn) {
    list(node.elements, 'elements', fn);
  }

  EmptyClassElement() {}

  ClassField(node, fn) {
    prop(node.name, 'name', fn);
    prop(node.initializer, 'initializer', fn);
  }

  ClassInitializer(node, fn) {
    list(node.statements, 'statements', fn);
  }

  ImportCall(node, fn) {
    prop(node.argument, 'argument', fn);
  }

  ImportDeclaration(node, fn) {
    prop(node.imports, 'imports', fn);
    prop(node.from, 'from', fn);
  }

  NamespaceImport(node, fn) {
    prop(node.identifier, 'identifier', fn);
  }

  NamedImports(node, fn) {
    list(node.specifiers, 'specifiers', fn);
  }

  DefaultImport(node, fn) {
    prop(node.identifier, 'identifier', fn);
    prop(node.imports, 'imports', fn);
  }

  ImportSpecifier(node, fn) {
    prop(node.imported, 'imported', fn);
    prop(node.local, 'local', fn);
  }

  ExportDeclaration(node, fn) {
    prop(node.declaration, 'declaration', fn);
  }

  ExportDefault(node, fn) {
    prop(node.binding, 'binding', fn);
  }

  ExportNameList(node, fn) {
    list(node.specifiers, 'specifiers', fn);
    prop(node.from, 'from', fn);
  }

  ExportNamespace(node, fn) {
    prop(node.identifier, 'identifier', fn);
    prop(node.from, 'from', fn);
  }

  ExportDefaultFrom(node, fn) {
    prop(node.identifier, 'identifier', fn);
    prop(node.from, 'from', fn);
  }

  ExportSpecifier(node, fn) {
    prop(node.local, 'local', fn);
    prop(node.exported, 'exported', fn);
  }

  Comment() {}

  Annotation(node, fn) {
    list(node.expressions, 'expressions', fn);
  }

}

const childVisitor = new ChildVisitor();

export function forEachChild(node, fn) {
  childVisitor[node.type](node, fn);
}
