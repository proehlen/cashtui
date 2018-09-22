// @flow

import Transaction from 'my-bitcoin-cash-lib/lib/Transaction';
import TransactionMenu from './TransactionMenu';
import state from '../model/state';
import stack from './stack';

import InputBase from './InputBase';

export default class TransactionIdInput extends InputBase {
  constructor() {
    super('Enter Transaction ID');
  }

  async onEnter() {
    try {
      const raw = await state.rpc.request(`getrawtransaction ${this._value}`);
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
