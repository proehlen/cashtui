// @flow

import Transaction from 'cashlib/lib/Transaction';

import ViewBase from './ViewBase';
import TransactionMenu from './TransactionMenu';
import state from '../../model/state';
import stack from '../stack';

import Input from '../components/Input';
import InputHelp from '../components/InputHelp';

export default class TransactionIdInput extends ViewBase {
  _input: Input
  _inputHelp: InputHelp

  constructor() {
    super('Enter Transaction ID');
    this._input = new Input(this.onEnter.bind(this));
    this._inputHelp = new InputHelp();
  }

  render() {
    this._inputHelp.render();
    this._input.render();
  }

  async handle(key: string) {
    await this._input.handle(key);
  }

  async onEnter() {
    try {
      const raw = await state.rpc.request(`getrawtransaction ${this._input.value}`);
      if (typeof raw === 'string') {
        const transaction = Transaction.deserialize(raw);
        state.transactions.active = transaction;
        stack.replace(new TransactionMenu());
      } else {
        throw new Error('Unexpected value returned from RPC call');
      }
    } catch (err) {
      stack.setError(err.message);
    }
  }
}
