import { parse } from '../../src/index.js';
import { runTests } from '../runner.js';

function process(source, options) {
  let { annotations } = parse(source, options);
  return Array.from(annotations).map(([node, list]) => {
    return { nodeType: node.type, list }
  });
}

runTests({
  dir:  import.meta.dirname,
  process,
  ignoreKeys: ['node', 'message', 'start', 'end'],
});
