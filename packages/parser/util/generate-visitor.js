const path = require('path');
const { readFileSync, writeFileSync } = require('fs');

let source = readFileSync(path.resolve(__dirname, '../src/AST.js'), 'utf-8');
let pattern = /(?:^|\n)export function (\w+)[\s\S]*?\n\}/g;
let props = /this\.(\w+)\s*=.+/g;
let list = [];

while (true) {
  let m = pattern.exec(source);
  if (!m) {
    break;
  }
  let out = '';
  props.lastIndex = 0;
  while (true) {
    let p = props.exec(m[0]);
    if (!p) {
      break;
    }
    if (!/\/\/\s*skip\s*$/.test(p[0])) {
      if (!out) {
        out = `  ${ m[1] }(node, fn) {\n`;
      }
      out += `    v('${ p[1] }', node.${ p[1] }, fn);\n`
    }
  }
  if (out) {
    list.push(out + '  }');
  } else {
    list.push(`  ${ m[1] }() {}`);
  }
}

let output =
`function v(key, value, fn) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; ++i) {
      fn(value[i], key, i);
    }
  } else if (value) {
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
