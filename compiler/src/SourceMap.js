const LINK_PREFIX = '\n\n//# sourceMappingURL=';

export function generateSourceMap(mappings, options = {}) {
  let sourceData = new Map();
  let defaultSource = '__source__';
  let hasContent = false;

  for (let item of options.sources || []) {
    if (item.default) {
      defaultSource = item.file;
    }
    if (item.content) {
      hasContent = true;
    }
    sourceData.set(item.file, item);
  }

  let names = new Map();
  let sources = new Map();
  let encodedMappings = serializeMappings(mappings, names, sources, defaultSource);

  let map = {
    version: 3,
    sources: [...sources.keys()],
    names: [...names.keys()],
    mappings: encodedMappings,
  };

  options.file && (map.file = options.file);
  options.sourceRoot && (map.sourceRoot = options.sourceRoot);

  if (hasContent) {
    map.sourcesContent = [...sources.keys()].map(source => {
      let entry = sourceData.get(source);
      return (entry && typeof entry.content === 'string') ? entry.content : null;
    });
  }

  return map;
}

export function encodeInlineSourceMap(sourceMap) {
  return LINK_PREFIX + 'data:application/json;charset=utf-8;base64,' +
    Buffer.from(JSON.stringify(sourceMap)).toString('base64');
}

export function encodeSourceMapLink(target) {
  return LINK_PREFIX + target;
}

const BASE64 = (
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  'abcdefghijklmnopqrstuvwxyz' +
  '0123456789+/'
).split('');

function toVLQSigned(v) {
  return v < 0 ? ((-v) << 1) + 1 : (v << 1) + 0;
}

function encodeVLQ(v) {
  let more = toVLQSigned(v);
  let encoded = '';

  do {
    let digit = more & 0b011111;
    more >>>= 5;
    encoded += BASE64[more ? digit | 0b100000 : digit];
  } while (more);

  return encoded;
}

function optionalStringEqual(a, b) {
  return a === b || (a == null && b == null);
}

function mappingsEqual(a, b) {
  return (
    a.generated.line === b.generated.line &&
    a.generated.column === b.generated.column &&
    a.original.line === b.original.line &&
    a.original.column === b.original.column &&
    optionalStringEqual(a.source, b.source) &&
    optionalStringEqual(a.name, b.name)
  );
}

function serializeMappings(mappings, names, sources, defaultSource) {
  let prevGeneratedLine = 0;
  let prevGeneratedColumn = 0;
  let prevOriginalLine = 0;
  let prevOriginalColumn = 0;
  let prevName = 0;
  let prevSource = 0;
  let result = '';

  for (let i = 0; i < mappings.length; ++i) {
    let mapping = mappings[i];

    if (mapping.generated.line !== prevGeneratedLine) {
      prevGeneratedColumn = 0;
      do {
        result += ';';
        prevGeneratedLine++;
      } while (mapping.generated.line !== prevGeneratedLine);
    } else if (i > 0) {
      if (mappingsEqual(mapping, mappings[i - 1])) {
        continue;
      }
      result += ',';
    }

    // Generated column
    result += encodeVLQ(mapping.generated.column - prevGeneratedColumn);
    prevGeneratedColumn = mapping.generated.column;

    let source = mapping.source || defaultSource;
    if (!sources.has(source)) {
      sources.set(source, sources.size);
    }

    // Source index
    let sourceIndex = sources.get(source);
    result += encodeVLQ(sourceIndex - prevSource);
    prevSource = sourceIndex;

    // Original line
    result += encodeVLQ(mapping.original.line - prevOriginalLine);
    prevOriginalLine = mapping.original.line;

    // Original column
    result += encodeVLQ(mapping.original.column - prevOriginalColumn);
    prevOriginalColumn = mapping.original.column;

    // Identifier name index
    if (mapping.name) {
      if (!names.has(mapping.name)) {
        names.set(mapping.name, names.size);
      }
      let nameIndex = names.get(mapping.name);
      result += encodeVLQ(nameIndex - prevName);
      prevName = nameIndex;
    }
  }

  return result;
}
