// @flow

import Connection from './model/Connection';
import stack from './view/stack';
import output from './view/output';
import NetworkSelection from './view/views/NetworkSelection';
import ConnectionHistory from './view/views/ConnectionHistory';

// Render starting view
if (Connection.getHistory().length) {
  stack.push(new ConnectionHistory());
} else {
  stack.push(new NetworkSelection());
}
stack.render();

const { stdin } = process;
// $flow-disable-line need raw mode; method appears to be available
stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.on('data', async (key) => {
  await stack.handle(key);
  stack.render();
});

// Re-render on window resize
process.stdout.on('resize', () => {
  output.resize();
  stack.render();
});
