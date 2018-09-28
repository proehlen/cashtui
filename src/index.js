// @flow

import Connection from './model/Connection';
import app from './view/app';
import output from './view/components/output';
import NetworkSelection from './view/views/NetworkSelection';
import ConnectionHistory from './view/views/ConnectionHistory';

// Render starting view
if (Connection.getHistory().length) {
  app.pushView(new ConnectionHistory());
} else {
  app.pushView(new NetworkSelection());
}
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
