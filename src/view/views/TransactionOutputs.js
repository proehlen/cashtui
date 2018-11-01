// @flow

import Transaction from 'cashlib/lib/Transaction';
import Output from 'cashlib/lib/Output';
import SelectView, { type SelectViewItem } from 'tooey/view/SelectView';
import ViewBase from 'tooey/view/ViewBase';
import Menu, { type MenuItem } from 'tooey/component/Menu';
import Tab from 'tooey/Tab';

import OutputsList from '../components/OutputsList';
import TransactionAddOutputP2PKH from './TransactionAddOutputP2PKH';
import TransactionAddOutputNonStandard from './TransactionAddOutputNonStandard';
import TransactionOutput from './TransactionOutput';
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
      visible: () => state.transactions.active.outputs.length > 0,
    }, {
      key: 'A',
      label: 'Add',
      help: 'Add new output',
      execute: this.onAddOutput.bind(this),
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

  async onAddOutput() {
    const items: SelectViewItem[] = [{
      label: 'Add P2PKH',
      execute: async () => this._tab.pushView(new TransactionAddOutputP2PKH(this._tab)),
    }, {
      label: 'Add P2PK',
    }, {
      label: 'Add P2SH',
    }, {
      label: 'Add Non-Standard',
      execute: async () => this._tab.pushView(new TransactionAddOutputNonStandard(this._tab)),
    }];
    const selectView = new SelectView(this._tab, 'Add Output', items);
    this._tab.pushView(selectView);
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
        this._tab,
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
