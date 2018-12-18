const { registerLoader } = require('./build/out/cli.js');

try {
  if (module.parent && module.parent.id === 'internal/preload') {
    registerLoader();
  }
} catch (e) {}
