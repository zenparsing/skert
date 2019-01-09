const path = require('path');
const { readdirSync } = require('fs');
const { validate } = require('./linter.js');

require('../build/out/cli.js').registerLoader({ validate });

readdirSync(path.resolve(__dirname, '../packages')).forEach(dir => {
  require(`../packages/${ dir }/test`);
});
