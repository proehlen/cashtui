// @flow

import Transaction from 'cashlib/lib/Transaction';
import Input from 'cashlib/lib/Input';

import ViewBase from './ViewBase';
import List from '../components/List';
import Menu from '../components/Menu';
import type { ListColumn } from '../components/List';
import state from '../../model/state';

export default class TransactionInputs extends ViewBase {
  _menu: Menu
  _list: List

  constructor() {
    super('Transaction Inputs');
    this._menu = new Menu();

    const transaction: Transaction = state.transactions.active;
    const inputs = transaction.inputs
      .map(this._mapInputToListRow);
    const columns: Array<ListColumn> = [{
      heading: 'Transaction Id',
      width: 64,
    }, {
      heading: 'Output',
      width: 8,
    }, {
      heading: 'Sig?',
      width: 4,
    }];

    this._list = new List(columns, inputs, true, this._menu);
  }

  _mapInputToListRow(input: Input): Array<string> {
    return [
      input.isCoinbase ? 'Coinbase' : input.transactionId,
      input.isCoinbase ? ' ' : input.outputIndex.toString(),
      input.signatureScript ? 'Yes' : '',
    ];
  }

  render() {
    // Render outputs list
    this._list.render();

    // Render menu last for correct cursor positioning
    this._menu.render(false);
  }

  async handle(key: string) {
    await this._menu.handle(key);
    await this._list.handle(key);
  }
}
