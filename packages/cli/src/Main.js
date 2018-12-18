import * as lib from './FileTranslator.js';
import * as fs from 'fs';
import * as path from 'path';

function parseArgs(argv) {
  let list = [];
  let map = new Map();
  let key = null;

  for (let part of argv) {
    if (part.startsWith('-')) {
      map.set(key = part, undefined);
    } else if (key) {
      map.set(key, part);
      key = null;
    } else {
      list.push(part);
    }
  }

  list.named = map;
  return list;
}

function fail(msg) {
  console.log(typeof msg === 'string' ? new Error(msg) : msg);
  process.exit(1);
}

export function main(argv = process.argv.slice(2)) {
  let args = parseArgs(argv);
  let inPath = args.length > 0 ? args[0].trim() : null;
  let outPath = null;
  let folder = false;
  let options = { createFolder: true, module: true };

  if (!inPath) {
    fail('Missing input path');
  }

  inPath = path.resolve(inPath);

  try {
    folder = fs.statSync(inPath).isDirectory();
  } catch (err) {
    fail(`Input path "${ inPath }" not found.`);
  }

  for (let [key, value] of args.named) {
    switch (key) {
      case '--output':
      case '-o':
        outPath = value;
        break;
      case '--script':
        options.module = false;
        break;
      case '--cjs':
        options.transformModules = true;
        break;
      case '--sourcemaps':
      case '-s':
        options.sourceMap = value || true;
        break;
    }
  }

  let promise;

  if (!outPath) {
    if (folder) {
      fail('Missing directory output option (--output or -o).');
    }
    promise = lib.translateFileToString(inPath, options).then(console.log);
  } else if (folder) {
    promise = lib.translateFolder(inPath, outPath, options);
  } else {
    promise = lib.translateFile(inPath, outPath, options);
  }

  promise.catch(fail);
}
