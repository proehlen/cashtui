// @flow

import Transaction from 'cashlib/lib/Transaction';
import Output from 'cashlib/lib/Output';
// import Address from 'cashlib/lib/Address';

import ViewBase from './ViewBase';
import List from '../components/List';
import Menu from '../components/Menu';
import type { ListColumn } from '../components/List';
import state from '../../model/state';
import stack from '../stack';

export default class TransactionOutputs extends ViewBase {
  _menu: Menu
  _list: List

  constructor() {
    super('Transaction Outputs');
    const transaction: Transaction = state.transactions.active;
    const inputs = transaction.outputs
      .map(TransactionOutputs._mapOutputToListRow);
    const columns: Array<ListColumn> = [{
      heading: 'Index',
      width: 8,
    }, {
      heading: 'Value (BCH)',
      width: 15,
    }, {
      heading: 'Address',
      width: 65,
    }];
    this._menu = new Menu();
    this._list = new List(columns, inputs, true, this._menu);
  }

  static _mapOutputToListRow(output: Output, index: number): Array<string> {
    const value = (output.value / 100000000).toFixed(8);
    let addressEncoded;
    try {
      const address = output.getAddress(state.connection.network);
      if (address) {
        addressEncoded = address.toString();
      }
    } catch (err) {
      stack.setWarning(err.message);
    }
    if (!addressEncoded) {
      addressEncoded = 'Sorry, not available yet';
    }
    return [index.toString(), value, addressEncoded];
  }

  render() {
    // Render outputs list
    this._list.render();

    // Render menu last for correct cursor positioning
    this._menu.render();
  }

  async handle(key: string) {
    await this._menu.handle(key);
    await this._list.handle(key);
  }
}
