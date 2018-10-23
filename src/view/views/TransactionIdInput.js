// @flow

import Transaction from 'cashlib/lib/Transaction';
import Input from 'tooey/lib/Input';
import InputHelp from 'tooey/lib/InputHelp';
import ViewBase from 'tooey/lib/ViewBase';
import Tab from 'tooey/lib/Tab';

import TransactionHeader from './TransactionHeader';
import state from '../../model/state';

export default class TransactionIdInput extends ViewBase {
  _tab: Tab
  _input: Input
  _inputHelp: InputHelp

  constructor(tab: Tab) {
    super('Transaction ID');
    this._tab = tab;
    this._input = new Input(tab, this.onEnter.bind(this));
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
        this._tab.replaceView(new TransactionHeader(this._tab));
      } else {
        throw new Error('Unexpected value returned from RPC call');
      }
    } catch (err) {
      this._tab.setError(err.message);
    }
  }
}
