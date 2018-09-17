// @flow
import { Transaction } from 'my-bitcoin-cash-lib';
import InputBase from './InputBase';
import TransactionMenu from './TransactionMenu';
import stack from './stack';
import state from '../model/state';

export default class RawTransactionInput extends InputBase {
  constructor() {
    super('Enter raw transaction');
  }

  onEnter() {
    state.transactions.active = Transaction.fromHex(this._text);
    stack.replace(new TransactionMenu());
  }
}
