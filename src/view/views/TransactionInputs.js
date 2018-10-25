// @flow

import Transaction from 'cashlib/lib/Transaction';
import Input from 'cashlib/lib/Input';
import ViewBase from 'tooey/lib/view/ViewBase';
import List, { type ListColumn } from 'tooey/lib/component/List';
import Menu, { type MenuItem } from 'tooey/lib/component/Menu';
import Tab from 'tooey/lib/Tab';
import SelectView, { type SelectViewItem } from 'tooey/lib/view/SelectView';

import TransactionInput from './TransactionInput';
import TransactionAddInputManual from './TransactionAddInputManual';
import state from '../../model/state';

export default class TransactionInputs extends ViewBase {
  _tab: Tab
  _menu: Menu
  _list: List<Input>

  constructor(tab: Tab) {
    super('Transaction Inputs');

    this._tab = tab;

    // Build menu
    const menuItems: MenuItem[] = [{
      key: 'S',
      label: 'Show',
      help: 'Show details for selected input',
      execute: this.toDetails.bind(this),
      visible: () => state.transactions.active.inputs.length > 0,
    }, {
      key: 'R',
      label: 'Remove',
      help: 'Remove selected input',
      execute: this.removeSelectedInput.bind(this),
      visible: () => state.transactions.active.inputs.length > 0,
    }, {
      key: 'A',
      label: 'Add',
      help: 'Add new input',
      execute: this.onAddInput.bind(this),
    }];
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

  async onAddInput() {
    const items: SelectViewItem[] = [{
      label: 'Select unspent output from node wallet',
    }, {
      label: 'Enter utxo manually',
      execute: async () => this._tab.replaceView(new TransactionAddInputManual(this._tab)),
    }];
    const selectView = new SelectView(this._tab, 'Add input from...', items);
    this._tab.pushView(selectView);
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
