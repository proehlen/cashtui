// @flow

import Transaction from 'cashlib/lib/Transaction';

import ViewBase from './ViewBase';
import TransactionMenu from './TransactionMenu';
import state from '../../model/state';
import stack from '../stack';

import Input from '../components/Input';

export default class TransactionIdInput extends ViewBase {
  _input: Input

  constructor() {
    super('Enter Transaction ID');
    this._input = new Input(this.onEnter.bind(this));
  }

  render() {
    this._input.render();
  }

  async handle(key: string) {
    await this._input.handle(key);
  }

  async onEnter() {
    try {
      const raw = await state.rpc.request(`getrawtransaction ${this._input.value}`);
      if (typeof raw === 'string') {
        const transaction = Transaction.fromHex(raw);
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
