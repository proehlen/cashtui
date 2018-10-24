// @flow

import Transaction from 'cashlib/lib/Transaction';
import Input from 'cashlib/lib/Input';
import ViewBase from 'tooey/lib/ViewBase';
import List from 'tooey/lib/List';
import Menu from 'tooey/lib/Menu';
import Tab from 'tooey/lib/Tab';
import MenuItem from 'tooey/lib/MenuItem';
import type { ListColumn } from 'tooey/lib/List';

import TransactionInput from './TransactionInput';
import TransactionAddInput from './TransactionAddInput';
import state from '../../model/state';

export default class TransactionInputs extends ViewBase {
  _tab: Tab
  _menu: Menu
  _list: List<Input>

  constructor(tab: Tab) {
    super('Transaction Inputs');

    this._tab = tab;

    // Build menu
    const menuItems = [
      new MenuItem('S', 'Show', 'Show details for selected input',
        this.toDetails.bind(this),
        () => state.transactions.active.inputs.length > 0),
      new MenuItem('R', 'Remove', 'Remove selected input',
        this.removeSelectedInput.bind(this),
        () => state.transactions.active.inputs.length > 0),
      new MenuItem('A', 'Add', 'Add new input',
        async () => this._tab.pushView(new TransactionAddInput(tab))),
    ];
    this._menu = new Menu(tab, menuItems);

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

    this._list = new List(tab, columns, transaction.inputs, {
      rowSelection: true,
      menu: this._menu,
    });
  }

  async toDetails() {
    const input = state.transactions.active.inputs[this._list.selectedRowIndex];
    if (input) {
      this._tab.pushView(new TransactionInput(
        input,
        state.transactions.active.getId(),
        this._list.selectedRowIndex,
      ));
    } else {
      this._tab.setWarning('No input selected');
    }
  }

  async removeSelectedInput() {
    state.transactions.active.removeInput(this._list.selectedRowIndex);
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
