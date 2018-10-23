// @flow

import output from 'tooey/lib/output';

import app from './view/app';

app.render();

const { stdin } = process;
// $flow-disable-line need raw mode; method appears to be available
stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.on('data', async (key) => {
  await app.handle(key);
  app.render();
});

// Re-render on window resize
process.stdout.on('resize', () => {
  output.resize();
  app.render();
});
