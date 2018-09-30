// @flow

import Transaction from 'cashlib/lib/Transaction';
import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuOption from 'tooey/lib/MenuOption';

import OutputsList from '../components/OutputsList';
import TransactionAddP2PKH from './TransactionAddP2PKH';
import state from '../../model/state';
import app from '../app';

export default class TransactionOutputs extends ViewBase {
  _menu: Menu
  _list: OutputsList

  constructor() {
    super('Transaction Outputs');
    const addOutput = new MenuOption('A', 'Add P2PKH', 'Add new Pay To Public Key Hash output',
      async () => app.pushView(new TransactionAddP2PKH()));
    this._menu = new Menu(app, [addOutput]);

    const transaction: Transaction = state.transactions.active;
    this._list = new OutputsList(transaction.outputs, this._menu);
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
