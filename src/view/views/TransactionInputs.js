// @flow

import Transaction from 'cashlib/lib/Transaction';
import Input from 'cashlib/lib/Input';
import ViewBase from 'tooey/lib/ViewBase';
import List from 'tooey/lib/List';
import Menu from 'tooey/lib/Menu';
import MenuOption from 'tooey/lib/MenuOption';
import type { ListColumn } from 'tooey/lib/List';

import TransactionAddInput from './TransactionAddInput';
import state from '../../model/state';
import app from '../app';

export default class TransactionInputs extends ViewBase {
  _menu: Menu
  _list: List

  constructor() {
    super('Transaction Inputs');
    const addInputOption = new MenuOption('A', 'Add', 'Add new input', async () => app.pushView(new TransactionAddInput()));
    this._menu = new Menu(app, [addInputOption]);

    const transaction: Transaction = state.transactions.active;
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

    this._list = new List(app, columns, transaction.inputs, {
      dataMapper: this._mapInputToListRow,
      menu: this._menu,
    });
  }

  _mapInputToListRow(input: Input): Array<string> {
    return [
      input.isCoinbase ? 'Coinbase' : input.transactionId,
      input.isCoinbase ? ' ' : input.outputIndex.toString(),
      input.signatureScript.length ? 'Yes' : '',
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
