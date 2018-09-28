// @flow

import Transaction from 'cashlib/lib/Transaction';
import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';

import TransactionOutputsList from '../components/TransactionOutputsList';
import state from '../../model/state';
import app from '../app';

export default class TransactionOutputs extends ViewBase {
  _menu: Menu
  _list: TransactionOutputsList

  constructor() {
    super('Transaction Outputs');
    this._menu = new Menu(app);

    const transaction: Transaction = state.transactions.active;
    this._list = new TransactionOutputsList(transaction.outputs, this._menu);
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
