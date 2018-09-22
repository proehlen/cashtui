// @flow

import Transaction from 'my-bitcoin-cash-lib/lib/Transaction';

import List from './List';
import state from '../../model/state';

export default class TransactionInputs extends List {
  constructor() {
    const transaction: Transaction = state.transactions.active;
    const inputToString = input => `${input.transactionId} ${input.outputIndex} ${input.signatureScript ? 'Signed' : ''}`;
    const inputs = transaction.inputs
      .map(inputToString);
    super(inputs, 'Transaction Inputs');
  }
}
