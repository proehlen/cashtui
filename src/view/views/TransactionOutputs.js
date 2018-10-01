// @flow

import Transaction from 'cashlib/lib/Transaction';
import Output from 'cashlib/lib/Output';
import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuOption from 'tooey/lib/MenuOption';

import OutputsList from '../components/OutputsList';
import TransactionOutput from './TransactionOutput';
import TransactionAddP2PKH from './TransactionAddP2PKH';
import state from '../../model/state';
import app from '../app';

export default class TransactionOutputs extends ViewBase {
  _menu: Menu
  _list: OutputsList

  constructor() {
    super('Transaction Outputs');
    const transaction: Transaction = state.transactions.active;

    const menuOptions = [
      new MenuOption('S', 'Show', 'Show details for selected output',
        this.toDetails.bind(this)),
      new MenuOption('A', 'Add P2PKH', 'Add new Pay To Public Key Hash output',
        async () => app.pushView(new TransactionAddP2PKH())),
    ];
    this._menu = new Menu(app, menuOptions);

    this._list = new OutputsList(transaction.outputs, this._menu, true);
  }

  async toDetails() {
    const output = state.transactions.active.outputs[this._list.selectedOutputIndex];
    if (output) {
      app.pushView(new TransactionOutput(
        output,
        state.transactions.active.getId(),
        this._list.selectedOutputIndex,
      ));
    } else {
      app.setWarning('No output selected');
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

  async handle(key: string) {
    await this._menu.handle(key);
    await this._list.handle(key);
  }
}
