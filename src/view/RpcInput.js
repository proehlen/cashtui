// @flow
import cliui from 'cliui';
import colors from 'colors';

import InputBase from './InputBase';
import RpcOutput from './RpcOutput';
import stack from './stack';
import state from '../model/state';
import output from './output';

import { KEY_UP, KEY_DOWN } from './keys';

export default class RawInput extends InputBase {
  _historyLevel: number

  constructor() {
    super('Enter RPC command');
    this._historyLevel = 0;
  }

  render() {
    if (!this._text) {
      output.cursorTo(0, 5);
      const ui = cliui();
      ui.div({
        text: colors.gray('Enter an RPC command that will be sent to the bitcoin node. ' +
          'E.g. enter \'help\' (without the quotes) to get a list of commands or \'help\' ' +
          'followed by a command name to get help for that command.\n\n' +
          'Use up and down arrows to navigate history.'),
      });
      console.log(ui.toString());
    }
    super.render();
  }

  _loadEarlier() {
    if (this._historyLevel < state.rpc.history.length) {
      this._historyLevel++;
    }
    this._loadFromHistory();
  }

  _loadLater() {
    if (this._historyLevel > 1) {
      this._historyLevel--;
      this._loadFromHistory();
    } else {
      // History exhausted - clear input
      this._text = '';
    }
  }

  _loadFromHistory() {
    if (!state.rpc.history.length) {
      stack.setWarning('No history found');
      return;
    }
    const index = state.rpc.history.length - this._historyLevel;
    this._text = this._text = state.rpc.history[index];
  }

  async handle(key: string): Promise<void> {
    switch (key) {
      case KEY_DOWN:
        this._loadLater();
        break;
      case KEY_UP:
        this._loadEarlier();
        break;
      default:
        await super.handle(key);
    }
  }

  async onEnter() {
    try {
      const rpcResult = await state.rpc.request(this._text, true);
      let output = [];
      if (typeof rpcResult === 'string') {
        output = rpcResult.split('\n');
      } else if (typeof rpcResult === 'number') {
        output.push(JSON.stringify(rpcResult));
      } else if (typeof rpcResult === 'object') {
        output = Object.entries(rpcResult).map((entry: [string, any]) => `${entry[0]}: ${JSON.stringify(entry[1])}`);
      } else if (Array.isArray(rpcResult)) {
        output.concat(rpcResult.map(entry => JSON.stringify(entry)));
      }
      if (output.length) {
        this._text = '';
        this._historyLevel = 0;
        stack.push(new RpcOutput(output));
      } else {
        stack.setError('Unexpected output received; don\'t know how to display');
      }
    } catch (err) {
      let errorMessage;
      if (err.message.includes('ECONNREFUSED')) {
        errorMessage = `Error: ECONNREFUSED (bitcoind possibly not running)`;
      } else if (err.message.includes('401')) {
        errorMessage = 'Error: 401 (Unauthorized)';
      } else {
        errorMessage = err.message;
      }
      stack.setError(errorMessage);
    }
  }
}