import { createRunner } from '../runner.js';

const test = createRunner({ module: true, transformModules: true });

test('export default from', `
  export x from 'a';
`, `
  'use strict';

  exports.x = require('a').default;
`);

test('export namespace', `
  export * from 'a';
`, `
  'use strict';

  Object.assign(exports, require('a'));
`);

test('export namespace with name', `
  export * as x from 'a';
`, `
  'use strict';

  exports.x = require('a');
`);

test('export one from', `
  export { x as y } from 'a';
`, `
  'use strict';

  exports.y = require('a').x;
`);

test('export multiple from', `
  export { x, y as z } from 'a';
`, `
  'use strict';

  let _a = require('a');
  exports.x = _a.x;
  exports.z = _a.y;
`);

test('import then export', `
  import { x } from 'a';
  export { x };
  export { x as y };
`, `
  'use strict';

  let _a = require('a');
  exports.x = _a.x;
  exports.y = _a.x;
`);

test('exports hoisted to top', `
  import { x } from 'a';
  export function f() {}
`, `
  'use strict';

  exports.f = f;
  let _a = require('a');

  function f() {}
`);

test('export default function', `
  export default function f() {}
`, `
  'use strict';

  exports.default = f;

  function f() {}
`);

test('export default anonymous function', `
  export default function() {}
`, `
  'use strict';

  exports.default = _default;

  function _default() {}
`);

test('export default class', `
  export default class C {}
`, `
  'use strict';

  class C {}

  exports.default = C;
`);

test('export default anonymous class', `
  export default class {}
`, `
  'use strict';

  class _default {}

  exports.default = _default;
`);

test('export default expression', `
  export default { x: 1, y: 2 };
`, `
  'use strict';

  exports.default = {
    x: 1,
    y: 2
  };
`)

test('export function', `
  export function f() {}
`, `
  'use strict';

  exports.f = f;

  function f() {}
`);

test('export class', `
  export class C {}
`, `
  'use strict';

  class C {}

  exports.C = C;
`);

test('export variables', `
  export let x = 1, y = 2, { z } = a, [m] = b;
`, `
  'use strict';

  let x = 1, y = 2, { z } = a, [m] = b;
  exports.x = x;
  exports.y = y;
  exports.z = z;
  exports.m = m;
`);

test('export locals', `
  const x = 1;
  export { x as y };
`, `
  'use strict';

  const x = 1;
  exports.y = x;
`);
