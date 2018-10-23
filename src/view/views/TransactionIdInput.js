// @flow

import Input from 'tooey/lib/Input';
import InputHelp from 'tooey/lib/InputHelp';
import ViewBase from 'tooey/lib/ViewBase';
import Transaction from 'cashlib/lib/Transaction';

import TransactionHeader from './TransactionHeader';
import state from '../../model/state';
import app from '../app';

export default class TransactionIdInput extends ViewBase {
  _input: Input
  _inputHelp: InputHelp

  constructor() {
    super('Transaction ID');
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
      const raw = await state.rpc.request(`getrawtransaction ${this._input.value}`);
      if (typeof raw === 'string') {
        const transaction = Transaction.deserialize(raw);
        state.transactions.active = transaction;
        app.replaceView(new TransactionHeader());
      } else {
        throw new Error('Unexpected value returned from RPC call');
      }
    } catch (err) {
      app.setError(err.message);
    }
  }
}
