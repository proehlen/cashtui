// @flow

import output from 'tooey/output';
import InputView from 'tooey/view/InputView';
import Tab from 'tooey/Tab';

import GenericList from './GenericList';
import GenericText from './GenericText';
import state from '../../model/state';

const onRpcCommandEnter = async (rpcCommand: string, tab: Tab) => {
  try {
    const rpcResult = await state.rpc.request(rpcCommand, true);
    if (typeof rpcResult === 'string') {
      const outputLines = rpcResult.split('\n');
      if (outputLines.length > 1 || rpcResult.length < output.width) {
        tab.pushView(new GenericList(tab, 'RPC result', outputLines));
      } else {
        tab.pushView(new GenericText('RPC result', rpcResult));
      }
    } else if (typeof rpcResult === 'number') {
      tab.pushView(new GenericText('RPC result', rpcResult.toString()));
    } else if (typeof rpcResult === 'object') {
      const stringified = JSON.stringify(rpcResult, null, 2);
      const outputLines = stringified.split('\n');
      tab.pushView(new GenericList(tab, 'RPC result', outputLines, true));
    } else if (Array.isArray(rpcResult)) {
      const outputLines = rpcResult.map(entry => JSON.stringify(entry));
      tab.pushView(new GenericList(tab, 'RPC result', outputLines, true));
    } else {
      tab.setError('Unexpected output received; don\'t know how to display');
      return;
    }
  } catch (err) {
    let errorMessage;
    if (err.message.includes('ECONNREFUSED')) {
      errorMessage = 'Error: ECONNREFUSED (bitcoind possibly not running)';
    } else if (err.message.includes('401')) {
      errorMessage = 'Error: 401 (Not authorized)';
    } else {
      [errorMessage] = err.message.split('\n');
    }
    tab.setError(errorMessage);
  }
};

const instructions = 'Enter an RPC command that will be sent to the bitcoin node. '
  + 'E.g. enter \'help\' (without the quotes) to get a list of commands or \'help\' '
  + 'followed by a command name to get help for that command.';

export default class RawInput extends InputView {
  constructor(tab: Tab) {
    super(tab, 'RPC command', async rpcCommand => onRpcCommandEnter(rpcCommand, tab), {
      instructions,
    });
  }
}
