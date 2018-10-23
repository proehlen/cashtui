// @flow
import Transaction from 'cashlib/lib/Transaction';
import ViewBase from 'tooey/lib/ViewBase';
import Input from 'tooey/lib/Input';
import InputHelp from 'tooey/lib/InputHelp';

import TransactionHeader from './TransactionHeader';
import app from '../app';
import state from '../../model/state';

export default class RawTransactionInput extends ViewBase {
  _input: Input
  _inputHelp: InputHelp

  constructor() {
    super('Enter raw transaction');
    this._input = new Input(app, this.onEnter.bind(this));
    this._inputHelp = new InputHelp();
  }

  render() {
    this._inputHelp.render();
    this._input.render();
  }

  async handle(key: string): Promise<boolean> {
    return this._input.handle(key);
  }

  async onEnter() {
    try {
      state.transactions.active = Transaction.deserialize(this._input.value);
      app.replaceView(new TransactionHeader());
    } catch (error) {
      app.setError(error.message);
    }
  }
}
