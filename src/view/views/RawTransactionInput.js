// @flow
import Transaction from 'cashlib/lib/Transaction';
import ViewBase from 'tooey/lib/ViewBase';
import Input from 'tooey/lib/Input';
import InputHelp from 'tooey/lib/InputHelp';
import Tab from 'tooey/lib/Tab';

import TransactionHeader from './TransactionHeader';
import state from '../../model/state';

export default class RawTransactionInput extends ViewBase {
  _tab: Tab
  _input: Input
  _inputHelp: InputHelp

  constructor(tab: Tab) {
    super('Enter raw transaction');
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
      state.transactions.active = Transaction.deserialize(this._input.value);
      this._tab.replaceView(new TransactionHeader(this._tab));
    } catch (error) {
      this._tab.setError(error.message);
    }
  }
}
