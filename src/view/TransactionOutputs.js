// @flow

import Transaction from 'my-bitcoin-cash-lib/lib/Transaction';
import Output from 'my-bitcoin-cash-lib/lib/Output';

import ListBase from './ListBase';
import state from '../model/state';

export default class TransactionInputs extends ListBase {
  constructor() {
    const transaction: Transaction = state.transactions.active;
    const mapOutputToString = (output: Output, index) => `${index} ${output.value}`;
    const inputs = transaction.outputs
      .map(mapOutputToString);
    super(inputs, 'Transaction Outputs');
  }
}
