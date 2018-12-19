import { createRunner } from '../runner.js';

const test = createRunner({ module: true, transformModules: true });

test('import default', `
  import x from 'a';
`, `
  'use strict';

  let _a = require('a');
  if (typeof _a === 'function') {
    _a = {
      default: _a
    };
  }
`);

test('import names', `
  import { x, y as z } from 'a';
  x;
  z;
`, `
  'use strict';

  let _a = require('a');
  _a.x;
  _a.y;
`);

test('import twice', `
  import { x } from 'a';
  import { y } from 'a';
  x;
  y;
`, `
  'use strict';

  let _a = require('a');
  _a.x;
  _a.y;
`);

test('import no shadowing', `
  import { x } from 'a';
  import { y } from 'b';
  let _a;
  _b();
`, `
  'use strict';

  let _a_1 = require('a');
  let _b_1 = require('b');
  let _a;
  _b();
`);

test('destructuring', `
  import { x } from 'a';
  ({ x });
  ({ x } = 1);
`, `
  'use strict';

  let _a = require('a');
  ({
    x: _a.x
  });
  ({
    x: _a.x
  } = 1);
`);

test('import call', `
  import('foo').then(x);
`, `
  'use strict';

  Promise.resolve(require('foo')).then(x);
`);

test('import and call', `
  import { x } from 'a';
  x();
`, `
  'use strict';

  let _a = require('a');
  (0, _a.x)();
`);
