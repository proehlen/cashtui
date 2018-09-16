// @flow
import cliui from 'cliui';
import colors from 'colors';

import InputBase from './InputBase';
import RpcOutput from './RpcOutput';
import stack from './stack';
import state from '../model/state';
import output from './output';

export default class RawInput extends InputBase {
  constructor() {
    super('Enter RPC command');
  }
  render() {
    if (!this._text) {
      output.cursorTo(0, 5);
      const ui = cliui();
      ui.div({
        text: colors.gray('Enter an RPC command that will be sent to your bitcoin node. ' +
          'E.g. enter \'help\' (without the quotes) to get a list of commands or \'help\' ' +
          'followed by a command name to get help for that command.'),
      });
      console.log(ui.toString());
    }
    super.render();
  }
  async onEnter() {
    try {
      const [method, ...params] = this._text.split(' ');
      const rpcResult = await state.rpc.request(method, ...params);
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
        stack.push(new RpcOutput(output));
      } else {
        stack.setError('Unexpected output received; don\'t know how to display');
      }
    } catch (err) {
      let errorMessage;
      if (err.message.includes('ECONNREFUSED')) {
        errorMessage = `Unable to connect to bitcoind (possibly not running): ECONNREFUSED`;
      } else if (err.message.includes('401')) {
        errorMessage = 'Unable to connect to bitcoind (possibly incorrect RPC credentials): server returned 401.';
      } else {
        errorMessage = err.message;
      }
      stack.setError(errorMessage);
    }
  }
}