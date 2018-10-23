// @flow

import cliui from 'cliui';
import colors from 'colors';
import output from 'tooey/lib/output';
import ViewBase from 'tooey/lib/ViewBase';
import Input from 'tooey/lib/Input';
import InputHelp, { DEFAULT_TEXT as INPUT_HELP_DEFAULT } from 'tooey/lib/InputHelp';
import { KEY_UP, KEY_DOWN } from 'tooey/lib/keys';

import GenericList from './GenericList';
import GenericText from './GenericText';
import state from '../../model/state';
import app from '../app';

export default class RawInput extends ViewBase {
  _historyLevel: number
  _input: Input
  _inputHelp: InputHelp

  constructor() {
    super('RPC command');
    this._historyLevel = 0;
    this._input = new Input(app, this.onEnter.bind(this));

    const inputHelpText = `${INPUT_HELP_DEFAULT}; ${colors.bold('Up')} and ${colors.bold('Down')} for history`;
    this._inputHelp = new InputHelp(inputHelpText);
  }

  render() {
    // Render instruction text
    if (!this._input.value) {
      output.cursorTo(0, 5);
      const ui = cliui();
      ui.div({
        text: colors.gray('Enter an RPC command that will be sent to the bitcoin node. '
          + 'E.g. enter \'help\' (without the quotes) to get a list of commands or \'help\' '
          + 'followed by a command name to get help for that command.'),
      });
      console.log(ui.toString());
    }

    this._inputHelp.render();

    // Render input last for correct cursor positioning
    this._input.render();
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
      this._input.value = '';
    }
  }

  _loadFromHistory() {
    if (!state.rpc.history.length) {
      app.setWarning('No history found');
      return;
    }
    const index = state.rpc.history.length - this._historyLevel;
    this._input.value = state.rpc.history[index];
  }

  async handle(key: string): Promise<boolean> {
    let handled = false;
    switch (key) {
      case KEY_DOWN:
        this._loadLater();
        handled = true;
        break;
      case KEY_UP:
        this._loadEarlier();
        handled = true;
        break;
      default:
        handled = await this._input.handle(key);
    }
    return handled;
  }

  async onEnter() {
    try {
      const rpcResult = await state.rpc.request(this._input.value, true);
      if (typeof rpcResult === 'string') {
        const outputLines = rpcResult.split('\n');
        if (outputLines.length > 1 || rpcResult.length < output.width) {
          app.pushView(new GenericList('RPC result', outputLines));
        } else {
          app.pushView(new GenericText('RPC result', rpcResult));
        }
      } else if (typeof rpcResult === 'number') {
        app.pushView(new GenericText('RPC result', rpcResult.toString()));
      } else if (typeof rpcResult === 'object') {
        const stringified = JSON.stringify(rpcResult, null, 2);
        const outputLines = stringified.split('\n');
        app.pushView(new GenericList('RPC result', outputLines));
      } else if (Array.isArray(rpcResult)) {
        const outputLines = rpcResult.map(entry => JSON.stringify(entry));
        app.pushView(new GenericList('RPC result', outputLines));
      } else {
        app.setError('Unexpected output received; don\'t know how to display');
        return;
      }
      this._input.value = '';
      this._historyLevel = 0;
    } catch (err) {
      let errorMessage;
      if (err.message.includes('ECONNREFUSED')) {
        errorMessage = 'Error: ECONNREFUSED (bitcoind possibly not running)';
      } else if (err.message.includes('401')) {
        errorMessage = 'Error: 401 (Not authorized)';
      } else {
        [errorMessage] = err.message.split('\n');
      }
      app.setError(errorMessage);
    }
  }
}
