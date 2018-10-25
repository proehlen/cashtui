// @flow

import { Transaction } from 'cashlib';
import ViewBase from 'tooey/lib/ViewBase';
import Menu, { type MenuItem } from 'tooey/lib/Menu';
import Tab from 'tooey/lib/Tab';

import RawTransactionInput from './RawTransactionInput';
import TransactionIdInput from './TransactionIdInput';
import state from '../../model/state';
import TransactionHeader from './TransactionHeader';

export default class TransactionsMenu extends ViewBase {
  _tab: Tab
  _menu: Menu

  constructor(tab: Tab) {
    super('Transactions');
    this._tab = tab;

    const items: MenuItem[] = [{
      key: 'I',
      label: 'By Id',
      help: 'Retrieve transaction from full node',
      execute: this.toTransactionIdInput.bind(this),
    }, {
      key: 'C',
      label: 'Create',
      help: 'Create new transaction',
      execute: this.createTransaction.bind(this),
    }, {
      key: 'D',
      label: 'Decode raw',
      help: 'Decode raw transaction',
      execute: this.toRawTransactionInput.bind(this),
    }, {
      key: 'R',
      label: 'Recent',
      help: 'Recent transactions',
    }];
    this._menu = new Menu(tab, items);
  }

  async toTransactionIdInput() {
    this._tab.pushView(new TransactionIdInput(this._tab));
  }

  async createTransaction() {
    state.transactions.active = new Transaction();
    this._tab.pushView(new TransactionHeader(this._tab));
  }

  async toRawTransactionInput() {
    this._tab.pushView(new RawTransactionInput(this._tab));
  }

  async handle(key: string): Promise<boolean> {
    return this._menu.handle(key);
  }

  render() {
    this._menu.render(false);
  }
}
