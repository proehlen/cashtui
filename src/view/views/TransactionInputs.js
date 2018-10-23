// @flow

import Transaction from 'cashlib/lib/Transaction';
import Input from 'cashlib/lib/Input';
import ViewBase from 'tooey/lib/ViewBase';
import List from 'tooey/lib/List';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
import type { ListColumn } from 'tooey/lib/List';

import TransactionInput from './TransactionInput';
import TransactionAddInput from './TransactionAddInput';
import state from '../../model/state';
import app from '../app';

export default class TransactionInputs extends ViewBase {
  _menu: Menu
  _list: List<Input>

  constructor() {
    super('Transaction Inputs');

    // Build menu
    const menuItems = [
      new MenuItem('S', 'Show', 'Show details for selected input',
        this.toDetails.bind(this)),
      new MenuItem('A', 'Add', 'Add new input',
        async () => app.pushView(new TransactionAddInput())),
    ];
    this._menu = new Menu(app, menuItems);

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
      rowSelection: true,
      menu: this._menu,
    });
  }

  async toDetails() {
    const input = state.transactions.active.inputs[this._list.selectedRowIndex];
    if (input) {
      app.pushView(new TransactionInput(
        input,
        state.transactions.active.getId(),
        this._list.selectedRowIndex,
      ));
    } else {
      app.setWarning('No input selected');
    }
  }

  render() {
    // Render outputs list
    this._list.render();

    // Render menu last for correct cursor positioning
    this._menu.render(false);
  }

  async handle(key: string): Promise<boolean> {
    let handled = await this._menu.handle(key);
    if (!handled) {
      handled = await this._list.handle(key);
    }
    return handled;
  }
}
