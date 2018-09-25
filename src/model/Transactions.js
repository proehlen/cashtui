// @flow
import Transaction from 'cashlib/lib/Transaction';

export default class Transactions {
  _active: Transaction

  set active(transaction: Transaction) {
    this._active = transaction;
  }

  get active(): Transaction {
    return this._active;
  }
}
