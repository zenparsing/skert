#!/usr/bin/env node
require('../build/out/cli.js').main().catch(err => {
  console.log(err.name === 'CliError' ? `Error: ${ err.message }` : err);
  process.exit(1);
});
