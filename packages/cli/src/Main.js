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

class CliError extends Error {
  get name() { return this.constructor.name }
}

export async function main(argv = process.argv.slice(2)) {
  let args = parseArgs(argv);
  let inPath = args.length > 0 ? args[0].trim() : null;
  let outPath = null;
  let folder = false;
  let options = { createFolder: true, module: true };

  if (!inPath) {
    throw new CliError('Missing input path');
  }

  inPath = path.resolve(inPath);

  try {
    folder = fs.statSync(inPath).isDirectory();
  } catch (err) {
    throw new CliError(`Input path "${ inPath }" not found`);
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

  if (folder && !outPath) {
    throw new CliError('Missing directory output option (--output or -o)');
  }

  if (!outPath) {
    let output = await lib.translateFileToString(inPath, options);
    console.log(output);
  } else if (folder) {
    await lib.translateFolder(inPath, outPath, options);
  } else {
    await lib.translateFile(inPath, outPath, options)
  }
}
