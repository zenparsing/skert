export function registerTransform({ define, loadModule }) {

  class ImportNamesVisitor {
    constructor() {
      this.importNames = new Map();
      this.importDeclarations = new Map();
      this.nameSet = null;
      this.from = null;
    }

    ImportDeclaration(path) {
      this.from = path.node.from.value;
      this.nameSet = new Set();
      this.importDeclarations.set(path.node, this.nameSet);
      path.visitChildren(this);
      this.from = null;
    }

    NamespaceImport(path) {
      let name = path.node.identifier.value;

      this.importNames.set(name, {
        imported: '*',
        from: this.from,
        nameSet: this.nameSet,
      });

      this.nameSet.add(name);
    }

    ImportSpecifier(path) {
      let { local, imported } = path.node;
      let name = (local || imported).value;

      this.importNames.set(name, {
        imported: imported.value,
        from: this.from,
        nameSet: this.nameSet,
      });

      this.nameSet.add(name);
    }

    DefaultImport(path) {
      path.visitChildren(this);

      let name = path.identifier.value;

      this.importNames.set(name, {
        imported: 'default',
        from: this.from,
        nameSet: this.nameSet,
      });

      this.nameSet.add(name);
    }
  }

  define(rootPath => rootPath.visit(new class AnnotationVisitor {

    constructor() {
      this.importNames = null;
      this.importDeclarations = null;
    }

    getImportNames() {
      if (!this.importNames) {
        let visitor = new ImportNamesVisitor();
        rootPath.visit(visitor);
        this.importNames = visitor.importNames;
        this.importDeclarations = visitor.importDeclarations;
      }
    }

    getMacroCallInfo(expr) {
      let args = [];
      let names;

      function visit(node) {
        switch (node.type) {
          case 'CallExpression':
            visit(node.callee);
            args = node.arguments;
            break;
          case 'MemberExpression':
            visit(node.object);
            names.push(node.property.value);
            break;
          case 'Identifier':
            names = [node.value];
            break;
        }
      }

      visit(expr);

      return [names, args];
    }

    Module(path) {
      path.visitChildren(this);

      let { importDeclarations } = this;
      if (!importDeclarations) {
        return;
      }

      // TODO: This will not remove names that were only used
      // for macros from an import declaration that imports
      // other names
      path.visitChildren(new class ImportRemoverVisitor {
        ImportDeclaration(path) {
          let set = importDeclarations.get(path.node);
          if (set && set.size === 0) {
            path.removeNode();
          }
        }
      });
    }

    after(path) {
      let annotations = path.getAnnotations();
      if (annotations.length === 0) {
        return;
      }

      this.getImportNames();

      for (let annotation of annotations) {
        for (let expression of annotation.expressions) {
          let [nameList, args] = this.getMacroCallInfo(expression);
          let name = nameList[0];
          let entry = this.importNames.get(name);
          if (!entry) {
            throw new Error(`Import not declared for macro "${ name }"`);
          }

          entry.nameSet.delete(name);

          let module = loadModule(entry.from);

          let fn = entry.imported === '*' ? module : module[entry.imported];
          for (let i = 1; i < nameList.length; ++i) {
            fn = fn[nameList[i]];
          }

          let node = fn(path.node, ...args);

          if (Array.isArray(node)) {
            path.replaceNode(...node);
          } else {
            path.replaceNode(node);
          }

          path.applyChanges();
        }
      }
    }

  }));
}
