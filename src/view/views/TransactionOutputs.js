// @flow

import Transaction from 'cashlib/lib/Transaction';
import Output from 'cashlib/lib/Output';
import ViewBase from 'tooey/lib/ViewBase';
import Menu, { type MenuItem } from 'tooey/lib/Menu';
import Tab from 'tooey/lib/Tab';

import OutputsList from '../components/OutputsList';
import TransactionOutput from './TransactionOutput';
import TransactionAddOutput from './TransactionAddOutput';
import state from '../../model/state';

export default class TransactionOutputs extends ViewBase {
  _tab: Tab
  _menu: Menu
  _list: OutputsList

  constructor(tab: Tab) {
    super('Transaction Outputs');
    this._tab = tab;
    const transaction: Transaction = state.transactions.active;

    const menuItems: MenuItem[] = [{
      key: 'S',
      label: 'Show',
      help: 'Show details for selected output',
      execute: this.toDetails.bind(this),
    }, {
      key: 'A',
      label: 'Add',
      help: 'Add new output',
      execute: async () => tab.pushView(new TransactionAddOutput(tab)),
    }, {
      key: 'R',
      label: 'Remove',
      help: 'Remove selected output',
      execute: this.removeSelectedOutput.bind(this),
      visible: () => state.transactions.active.outputs.length > 0,
    }];
    this._menu = new Menu(tab, menuItems);

    this._list = new OutputsList(tab, transaction.outputs, this._menu, true);
  }

  get _selectedOutput() {
    return state.transactions.active.outputs[this._list.selectedOutputIndex];
  }

  async removeSelectedOutput() {
    state.transactions.active.removeOutput(this._list.selectedOutputIndex);
  }

  async toDetails() {
    const output = this._selectedOutput;
    if (output) {
      this._tab.pushView(new TransactionOutput(
        output,
        state.transactions.active.getId(),
        this._list.selectedOutputIndex,
      ));
    } else {
      this._tab.setWarning('No output selected');
    }
  }

  getSelectedOutput(): Output {
    const selectedIndex = this._list.selectedOutputIndex;
    return state.transactions.active.outputs[selectedIndex];
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
