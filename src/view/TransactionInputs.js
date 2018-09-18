// @flow

import Transaction from 'my-bitcoin-cash-lib/lib/Transaction';

import ListBase from './ListBase';
import state from '../model/state';

export default class TransactionInputs extends ListBase {
  constructor() {
    const transaction: Transaction = state.transactions.active;
    const inputToString = input => `${input.transactionId}:${input.outputIndex}`;
    const inputs = transaction.inputs
      .map(inputToString);
    super(inputs, 'Transaction Inputs');
  }
}
