const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { name, version } = require('../package.json');

function $(p) { return path.resolve(__dirname, '../', p); }

const dir = $('build/bootstrap');
const outDir = $('build/out');

function main() {
  console.log('\n== Selfhosting Bootstrap ==\n');

  if (fs.existsSync($('build/out/cli.js'))) {
    console.log('Build output already exists.\n')
    return;
  }

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  console.log('..Creating temp folder');

  rimraf.sync(dir);
  fs.mkdirSync(dir);

  fs.writeFileSync(
    path.resolve(dir, 'package.json'),
    JSON.stringify({
      dependencies: {
        [name]: version,
      },
    }),
    { encoding: 'utf8' }
  );

  console.log(`..Installing ${ name }@${ version }\n`);

  let result = spawnSync('npm', ['install'], {
    env: process.env,
    stdio: 'inherit',
    cwd: dir,
    shell: true,
  });

  if (result.error) {
    throw result.error;
  }

  console.log('..Copying bundle to dist/');

  // Copy bundled files into out folder
  fs.copyFileSync(
    path.resolve(dir, `node_modules/${ name }/build/out/compiler.js`),
    $('build/out/compiler.js')
  );

  fs.copyFileSync(
    path.resolve(dir, `node_modules/${ name }/build/out/cli.js`),
    $('build/out/cli.js')
  );

  console.log('..Clearing temp folder');
  rimraf.sync(dir);

  console.log('..Done\n');
}

main();
