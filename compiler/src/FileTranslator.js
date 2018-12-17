import { compile } from './Compiler.js';
import { encodeSourceMapLink } from './SourceMap.js';
import * as fs from 'fs';
import * as path from 'path';

function getStat(p) {
  return new Promise((resolve, reject) => {
    fs.stat(p, (err, stat) => {
      if (err) reject(err);
      else resolve(stat);
    });
  });
}

async function listFolder(p) {
  return new Promise((resolve, reject) => {
    fs.readdir(p, (err, names) => {
      if (err) reject(err);
      else resolve(names);
    });
  }).then(names => {
    return Promise.all(names.map(name => {
      let fullPath = path.join(p, name);
      return getStat(fullPath).then(stat => {
        return { name, path: fullPath, directory: stat.isDirectory() };
      });
    }));
  });
}

function createFolder(p) {
  function create() {
    return new Promise((resolve, reject) => {
      let mode = 0o777 & (~process.umask());
      fs.mkdir(p, mode, err => {
        if (err) reject(err);
        else resolve(p);
      });
    });
  }

  return create().catch(err => {
    if (err.code === 'ENOENT') {
      return createFolder(path.dirname(p)).then(create);
    }
    throw err;
  }).catch(err => {
    return getStat(p).then(stat => {
      if (stat.isDirectory()) {
        return p;
      }
      throw err;
    }, () => {
      throw err;
    });
  });
}

function readInput(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function writeOutput(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => {
      if (err) reject(err);
      else resolve(path);
    });
  });
}

export async function translateFileToString(inPath, options = {}) {
  inPath = path.resolve(inPath);
  let source = await readInput(inPath);
  let result = compile(source, {
    location: inPath,
    transformModules: options.transformModules,
    sourceMap: options.sourceMap,
  });
  return result.output;
}

export async function translateFile(inPath, outPath, options = {}) {
  inPath = path.resolve(inPath);
  outPath = path.resolve(outPath);

  if (inPath === outPath) {
    throw new Error('Input path and output path are identical');
  }

  if (options.createFolder) {
    await createFolder(path.dirname(outPath));
  }

  let source = await readInput(inPath);
  let result = compile(source, {
    location: inPath,
    transformModules: options.transformModules,
    sourceMap: options.sourceMap,
  });

  if (result.sourceMap) {
    await writeOutput(outPath + '.map', JSON.stringify(result.sourceMap));
    result.output += encodeSourceMapLink(`${ path.basename(outPath) }.map`);
  }

  await writeOutput(outPath, result.output);
}

export async function translateFolder(inPath, outPath, options = {}) {
  inPath = path.resolve(inPath);
  outPath = path.resolve(outPath);

  if (inPath === outPath) {
    throw new Error('Input path and output path are identical');
  }

  let entries = await listFolder(inPath);
  await createFolder(outPath);

  for (let entry of entries) {
    if (entry.directory) {
      await translateFolder(entry.path, path.join(outPath, entry.name), options);
    } else {
      let fileOptions = Object.assign({}, options, {
        createFolder: false,
      });
      await translateFile(entry.path, path.join(outPath, entry.name), fileOptions);
    }
  }
}
