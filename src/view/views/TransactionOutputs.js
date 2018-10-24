// @flow

import Transaction from 'cashlib/lib/Transaction';
import Output from 'cashlib/lib/Output';
import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
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

    const menuItems = [
      new MenuItem('S', 'Show', 'Show details for selected output',
        this.toDetails.bind(this)),
      new MenuItem('A', 'Add', 'Add new output',
        async () => tab.pushView(new TransactionAddOutput(tab))),
      new MenuItem('R', 'Remove', 'Remove selected output',
        this.removeSelectedOutput.bind(this),
        () => state.transactions.active.outputs.length > 0),
    ];
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
