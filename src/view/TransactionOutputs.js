// @flow

import Transaction from 'my-bitcoin-cash-lib/lib/Transaction';
import Output from 'my-bitcoin-cash-lib/lib/Output';
// import Address from 'my-bitcoin-cash-lib/lib/Address';

import ListBase from './ListBase';
import state from '../model/state';

export default class TransactionOutputs extends ListBase {
  constructor() {
    const transaction: Transaction = state.transactions.active;
    const inputs = transaction.outputs
      .map(TransactionOutputs._mapOutputToString);
    super(inputs, 'Transaction Outputs');
  }

  static _mapOutputToString(output: Output, index: number) {
    const value = (output.value / 100000000).toFixed(8);
    // const address: Address = output.getAddress(state.rpc.network);
    // return `${index} ${value} ${address.toString()}`;
    return `${index} ${value}`;
  }
}
