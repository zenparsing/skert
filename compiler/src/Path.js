import { AST, resolveScopes } from './Parser.js';

const Node = Symbol();
const Location = Symbol();
const Parent = Symbol();
const ScopeInfo = Symbol();
const ChangeList = Symbol();

export class Path {

  constructor(node, parent = null, location = null) {
    this[Node] = node;
    this[Location] = location;
    this[Parent] = parent;
    this[ScopeInfo] = parent ? parent[ScopeInfo] : null;
    this[ChangeList] = [];
  }

  get node() {
    return this[Node];
  }

  get parent() {
    return this[Parent];
  }

  get parentNode() {
    return this[Parent] ? this[Parent][Node] : null;
  }

  forEachChild(fn) {
    if (!this[Node]) {
      return;
    }

    let paths = [];

    AST.forEachChild(this[Node], (child, key, index) => {
      let path = new Path(child, this, { key, index });
      paths.push(path);
      fn(path);
    });

    for (let path of paths) {
      path.applyChanges();
    }
  }

  applyChanges() {
    let list = this[ChangeList];
    this[ChangeList] = [];

    for (let record of list) {
      if (!this[Node]) {
        break;
      }
      record.apply();
    }
  }

  removeNode() {
    this[ChangeList].push(new ChangeRecord(this, 'replaceNode', [null]));
  }

  replaceNode(newNode) {
    this[ChangeList].push(new ChangeRecord(this, 'replaceNode', [newNode]));
  }

  insertNodesBefore(...nodes) {
    this[ChangeList].push(new ChangeRecord(this, 'insertNodesBefore', nodes));
  }

  insertNodesAfter(...nodes) {
    this[ChangeList].push(new ChangeRecord(this, 'insertNodesAfter', nodes));
  }

  visitChildren(visitor) {
    this.forEachChild(childPath => childPath.visit(visitor));
  }

  visit(visitor) {
    // TODO: applyChanges will not be run if called from top-level. Is this a problem?
    if (!this[Node]) {
      return;
    }

    let method = visitor[this[Node].type];
    if (typeof method === 'function') {
      method.call(visitor, this);
    }

    if (!this[Node]) {
      return;
    }

    let { after } = visitor;
    if (typeof after === 'function') {
      after.call(visitor, this);
    }

    if (!method) {
      this.visitChildren(visitor);
    }
  }

  uniqueIdentifier(baseName, options = {}) {
    let scopeInfo = this[ScopeInfo];
    let ident = null;

    for (let i = 0; true; ++i) {
      let value = baseName;
      if (i > 0) value += '_' + i;
      if (!scopeInfo.names.has(value)) {
        ident = value;
        break;
      }
    }

    scopeInfo.names.add(ident);

    if (options.kind) {
      this[ChangeList].push(new ChangeRecord(this, 'insertDeclaration', [ident, options]));
    }

    return ident;
  }

  static fromParseResult(result) {
    let path = new Path(result.ast);
    path[ScopeInfo] = getScopeInfo(result);
    return path;
  }

}

class ChangeRecord {

  constructor(path, name, args) {
    this.path = path;
    this.name = name;
    this.args = args;
  }

  apply() {
    switch (this.name) {
      case 'replaceNode': return this.replaceNode(this.args[0]);
      case 'insertNodesAfter': return this.insertNodesAfter(this.args);
      case 'insertNodesBefore': return this.insertNodesBefore(this.args);
      case 'insertDeclaration': return this.insertDeclaration(...this.args);
      default: throw new Error('Invalid change record type');
    }
  }

  replaceNode(newNode) {
    if (this.path[Parent]) {
      getLocation(this.path, (parent, key, index) => {
        if (typeof index !== 'number') {
          parent[key] = newNode;
        } else if (newNode) {
          parent[key].splice(index, 1, newNode);
        } else {
          parent[key].splice(index, 1);
        }
      });
    }

    this.path[Node] = newNode;
  }

  insertNodesAfter(nodes) {
    getLocation(this.path, (parent, key, index) => {
      if (typeof index !== 'number') {
        throw new Error('Node is not contained within a node list');
      }
      parent[key].splice(index + 1, 0, ...nodes);
    });
  }

  insertNodesBefore(nodes) {
    getLocation(this.path, (parent, key, index) => {
      if (typeof index !== 'number') {
        throw new Error('Node is not contained within a node list');
      }
      parent[key].splice(index, 0, ...nodes);
    });
  }

  insertDeclaration(ident, options) {
    let { statements } = getBlock(this.path).node;
    let i = 0;

    while (i < statements.length) {
      if (statements[i].type !== 'VariableDeclaration') break;
      i += 1;
    }

    statements.splice(i, 0, {
      type: 'VariableDeclaration',
      kind: options.kind,
      declarations: [{
        type: 'VariableDeclarator',
        pattern: { type: 'Identifier', value: ident },
        initializer: options.initializer || null,
      }],
    });
  }

}

function getLocation(path, fn) {
  if (!path[Parent]) {
    throw new Error('Node does not have a parent');
  }

  let { key, index } = path[Location];
  let node = path[Node];
  let parent = path[Parent][Node];

  let valid = typeof index === 'number' ?
    parent[key][index] === node :
    parent[key] === node;

  if (!valid) {
    AST.forEachChild(parent, (child, k, i, stop) => {
      if (child === node) {
        valid = true;
        path[Location] = { key: (key = k), index: (index = i) };
        return stop;
      }
    });
  }

  if (!valid) {
    throw new Error('Unable to determine node location');
  }

  fn(parent, key, index);
}

function getScopeInfo(parseResult) {
  let scopeTree = resolveScopes(parseResult.ast, { lineMap: parseResult.lineMap });
  let names = new Set();

  function visit(scope) {
    scope.names.forEach((value, key) => names.add(key));
    scope.free.forEach(ident => names.add(ident.value));
    scope.children.forEach(visit);
  }

  visit(scopeTree);

  return { names };
}

function getBlock(path) {
  while (path) {
    switch (path.node.type) {
      case 'Script':
      case 'Module':
      case 'Block':
      case 'FunctionBody':
        return path;
    }
    path = path.parent;
  }
  return null;
}
