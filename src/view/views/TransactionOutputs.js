// @flow

import Transaction from 'cashlib/lib/Transaction';
import Output from 'cashlib/lib/Output';
// import Address from 'cashlib/lib/Address';

import ViewBase from './ViewBase';
import List from '../components/List';
import Menu from '../components/Menu';
import type { ListColumn } from '../components/List';
import state from '../../model/state';

export default class TransactionOutputs extends ViewBase {
  _menu: Menu
  _list: List

  constructor() {
    super('Transaction Outputs');
    const transaction: Transaction = state.transactions.active;
    const inputs = transaction.outputs
      .map(TransactionOutputs._mapOutputToString)
      .map(rec => [rec]);
    const columns: Array<ListColumn> = [{ heading: 'Outputs', width: 999 }];
    this._menu = new Menu();
    this._list = new List(columns, inputs, true, this._menu);
  }

  static _mapOutputToString(output: Output, index: number) {
    const value = (output.value / 100000000).toFixed(8);
    // const address: Address = output.getAddress(state.rpc.network);
    // return `${index} ${value} ${address.toString()}`;
    return `${index} ${value}`;
  }
}
