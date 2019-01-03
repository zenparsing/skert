const path = require('path');
const { readdirSync } = require('fs');

require('../loader');

readdirSync(path.resolve(__dirname, '../packages')).forEach(dir => {
  require(`../packages/${ dir }/test`);
});
