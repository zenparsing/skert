import { AST, resolveScopes } from './Parser.js';

export class Path {

  constructor(node, parent = null, location = null) {
    @node = node;
    @location = location;
    @parent = parent;
    @scopeInfo = parent ? parent.@scopeInfo : null;
    @changeList = [];
  }

  get node() {
    return @node;
  }

  get parent() {
    return @parent;
  }

  get parentNode() {
    return @parent ? @parent.@node : null;
  }

  forEachChild(fn) {
    if (!@node) {
      return;
    }

    let paths = [];

    AST.forEachChild(@node, (child, key, index) => {
      let path = new Path(child, this, { key, index });
      paths.push(path);
      fn(path);
    });

    for (let path of paths) {
      path.applyChanges();
    }
  }

  applyChanges() {
    let list = @changeList;
    @changeList = [];

    for (let record of list) {
      if (!@node) {
        break;
      }
      record.apply();
    }
  }

  removeNode() {
    @changeList.push(new ChangeRecord(this, 'replaceNode', [null]));
  }

  replaceNode(newNode) {
    @changeList.push(new ChangeRecord(this, 'replaceNode', [newNode]));
  }

  insertNodesBefore(...nodes) {
    @changeList.push(new ChangeRecord(this, 'insertNodesBefore', nodes));
  }

  insertNodesAfter(...nodes) {
    @changeList.push(new ChangeRecord(this, 'insertNodesAfter', nodes));
  }

  visitChildren(visitor) {
    this.forEachChild(childPath => childPath.visit(visitor));
  }

  visit(visitor) {
    // TODO: applyChanges will not be run if called from top-level. Is this a problem?
    if (!@node) {
      return;
    }

    let method = visitor[@node.type];
    if (typeof method === 'function') {
      method.call(visitor, this);
    }

    if (!@node) {
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
    let scopeInfo = @scopeInfo;
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
      @changeList.push(new ChangeRecord(this, 'insertDeclaration', [ident, options]));
    }

    return ident;
  }

  static fromParseResult(result) {
    let path = new Path(result.ast);
    path.@scopeInfo = getScopeInfo(result);
    return path;
  }

  @getLocation(fn) {
    if (!@parent) {
      throw new Error('Node does not have a parent');
    }

    let { key, index } = @location;
    let node = @node;
    let parent = @parent.@node;

    let valid = typeof index === 'number' ?
      parent[key][index] === node :
      parent[key] === node;

    if (!valid) {
      AST.forEachChild(parent, (child, k, i, stop) => {
        if (child === node) {
          valid = true;
          @location = { key: (key = k), index: (index = i) };
          return stop;
        }
      });
    }

    if (!valid) {
      throw new Error('Unable to determine node location');
    }

    fn(parent, key, index);
  }

}

class ChangeRecord {

  constructor(path, name, args) {
    @path = path;
    @name = name;
    @args = args;
  }

  apply() {
    switch (@name) {
      case 'replaceNode': return this.replaceNode(@args[0]);
      case 'insertNodesAfter': return this.insertNodesAfter(@args);
      case 'insertNodesBefore': return this.insertNodesBefore(@args);
      case 'insertDeclaration': return this.insertDeclaration(...@args);
      default: throw new Error('Invalid change record type');
    }
  }

  replaceNode(newNode) {
    if (@path.@parent) {
      @path.@getLocation((parent, key, index) => {
        if (typeof index !== 'number') {
          parent[key] = newNode;
        } else if (newNode) {
          parent[key].splice(index, 1, newNode);
        } else {
          parent[key].splice(index, 1);
        }
      });
    }

    @path.@node = newNode;
  }

  insertNodesAfter(nodes) {
    @path.@getLocation((parent, key, index) => {
      if (typeof index !== 'number') {
        throw new Error('Node is not contained within a node list');
      }
      parent[key].splice(index + 1, 0, ...nodes);
    });
  }

  insertNodesBefore(nodes) {
    @path.@getLocation((parent, key, index) => {
      if (typeof index !== 'number') {
        throw new Error('Node is not contained within a node list');
      }
      parent[key].splice(index, 0, ...nodes);
    });
  }

  insertDeclaration(ident, options) {
    let { statements } = getBlock(@path).node;
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
