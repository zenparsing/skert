#!/usr/bin/env node
require('../build/out/cli.js').main().catch(err => {
  console.log(String(err));
  process.exit(1);
});
