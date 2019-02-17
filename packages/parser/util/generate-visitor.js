const path = require('path');
const { readFileSync, writeFileSync } = require('fs');

let source = readFileSync(path.resolve(__dirname, '../src/AST.js'), 'utf-8');
let ctorPattern = /(?:^|\n)export function (\w+)[\s\S]*?\n\}/g;
let propPattern = /this\.(\w+)\s*=.+/g;
let attrPattern = /\/\/\s*(\w+)\s*$/;
let list = [];

while (true) {
  let ctorMatch = ctorPattern.exec(source);
  if (!ctorMatch) {
    break;
  }

  let type = ctorMatch[1];
  let out = '';

  propPattern.lastIndex = 0;
  while (true) {
    let propMatch = propPattern.exec(ctorMatch[0]);
    if (!propMatch) {
      break;
    }

    let prop = propMatch[1];
    let attrMatch = attrPattern.exec(propMatch[0]);
    let attr = attrMatch ? attrMatch[1] : '';

    if (attr !== 'value') {
      if (!out) {
        out = `  ${ type }(node, fn) {\n`;
      }
      if (attr === 'list') {
        out += `    list(node.${ prop }, '${ prop }', fn);\n`
      } else {
        out += `    prop(node.${ prop }, '${ prop }', fn);\n`;
      }
    }
  }
  if (out) {
    list.push(out + '  }');
  } else {
    list.push(`  ${ type }() {}`);
  }
}

let output =
`function list(value, key, fn) {
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

${ list.join('\n\n') }

}

const childVisitor = new ChildVisitor();

export function forEachChild(node, fn) {
  childVisitor[node.type](node, fn);
}
`;

writeFileSync(path.resolve(__dirname, '../src/Visitor.js'), output);
