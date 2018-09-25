// @flow
import Transaction from 'cashlib/lib/Transaction';

import ViewBase from './ViewBase';
import Input from '../components/Input';
import TransactionMenu from './TransactionMenu';
import stack from '../stack';
import state from '../../model/state';

export default class RawTransactionInput extends ViewBase {
  _input: Input

  constructor() {
    super('Enter raw transaction');
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
      state.transactions.active = Transaction.fromHex(this._input.value);
      stack.replace(new TransactionMenu());
    } catch (error) {
      stack.setError(error.message);
    }
  }
}
