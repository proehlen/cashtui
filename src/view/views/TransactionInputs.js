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
  _list: List<Input>

  constructor() {
    super('Transaction Inputs');
    const addInputOption = new MenuOption('A', 'Add', 'Add new input', async () => app.pushView(new TransactionAddInput()));
    this._menu = new Menu(app, [addInputOption]);

    const transaction: Transaction = state.transactions.active;
    const columns: Array<ListColumn<Input>> = [{
      heading: 'Transaction Id',
      width: 64,
      value: input => input.isCoinbase ? 'Coinbase' : input.transactionId,
    }, {
      heading: 'Output',
      width: 8,
      value: input => input.isCoinbase ? ' ' : input.outputIndex.toString(),
    }, {
      heading: 'Sig?',
      width: 4,
      value: input => input.signatureScript.length ? 'Yes' : '',
    }];

    this._list = new List(app, columns, transaction.inputs, {
      menu: this._menu,
    });
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
