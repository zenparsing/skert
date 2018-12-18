const { resolve } = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
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

function smokeTest() {
  return new Promise((resolve, reject) => {
    let child = spawn('node', [
      '../bin/skreet.js',
      '../parser/src/Parser.js',
    ], {
      cwd: __dirname,
      env: process.env,
      stdio: ['ignore', 'ignore', 'inherit'],
    });

    child.on('exit', code => {
      if (code !== 0) {
        reject(new Error('Smoke test failed'));
      } else {
        resolve();
      }
    });
  });
}

function saveCurrent() {
  function store() {
    if (!fs.existsSync($('build/lkg'))) {
      fs.mkdirSync($('build/lkg'));
    }
    let dir = $(`build/lkg/${ Date.now() }`);
    fs.mkdirSync(dir);
    fs.writeFileSync(`${ dir }/cli.js`, cliCode, { encoding: 'utf8' });
    fs.writeFileSync(`${ dir }/compiler.js`, compilerCode, { encoding: 'utf8' });
  }

  function restore() {
    fs.writeFileSync('build/out/cli.js', cliCode, { encoding: 'utf8' });
    fs.writeFileSync('build/out/compiler.js', compilerCode, { encoding: 'utf8' });
  }

  let cliCode = fs.readFileSync($('build/out/cli.js'), 'utf8');
  let compilerCode = fs.readFileSync($('build/out/compiler.js'), 'utf8');

  return { store, restore };
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
  let current;

  try {
    current = await saveCurrent();

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

    await smokeTest();

    await current.store();

  } catch (e) {
    if (current) {
      await current.restore();
    }
    trap(e);
  }
}

main();
