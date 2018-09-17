// @flow
import { Transaction } from 'my-bitcoin-cash-lib';


export default class Transactions {
  _active: Transaction

  set active(transaction: Transaction) {
    this._active = transaction;
  }

  get active() {
    return this._active;
  }
}
