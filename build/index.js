const { resolve } = require('path');
const fs = require('fs');
const { rollup } = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const { compile } = require('./out/compiler.js');

function $(p) {
  return resolve(__dirname, '../', p);
}

function trap(err) {
  console.log(err);
  process.exit(1);
}

function selfhostPlugin() {
  return {
    name: 'selfhost',
    transform(code, id) {
      let result = compile(code, {
        location: id,
        module: true,
        sourceMap: true,
      });

      return {
        code: result.output,
        map: result.sourceMap,
      };
    },
  };
}

function saveCurrent() {
  function store() {
    if (!fs.existsSync($('build/lkg'))) {
      fs.mkdirSync($('build/lkg'));
    }
    let baseDir = $(`build/lkg/${ new Date().toISOString().slice(0, 10) }`);
    let dir = baseDir;
    for (let i = 1; fs.existsSync(dir); i += 1) {
      dir = baseDir + '.' + i;
    }
    fs.mkdirSync(dir);
    fs.writeFileSync(`${ dir }/cli.js`, cliCode, { encoding: 'utf8' });
    fs.writeFileSync(`${ dir }/compiler.js`, compilerCode, { encoding: 'utf8' });
  }

  let cliCode = fs.readFileSync($('build/out/cli.js'), 'utf8');
  let compilerCode = fs.readFileSync($('build/out/compiler.js'), 'utf8');

  return { store };
}

async function bundle(options) {
  let bundle = await rollup({
    input: options.input,
    plugins: [selfhostPlugin(), nodeResolve()],
    external: options.external,
  });

  await bundle.write({
    file: options.output,
    format: 'cjs',
    paths: options.path,
  });
}

async function main() {
  try {
    let current = await saveCurrent();

    await bundle({
      input: $('compiler/src/default.js'),
      output: $('build/out/compiler.js'),
    });

    await bundle({
      input: $('cli/src/default.js'),
      output: $('build/out/cli.js'),
      external: ['path', 'fs', 'module', $('cli/src/Compiler.js')],
      paths: {
        [$('cli/src/Compiler.js')]: './compiler.js',
      },
    });

    await current.store();
  } catch (e) {
    trap(e);
  }
}

main();
