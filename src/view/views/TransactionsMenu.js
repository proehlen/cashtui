// @flow

import { Transaction } from 'cashlib';
import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
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

    const items: MenuItem[] = [
      new MenuItem('I', 'By Id', 'Retrieve transaction from full node', this.toTransactionIdInput.bind(this)),
      new MenuItem('C', 'Create', 'Create new transaction', this.createTransaction.bind(this)),
      new MenuItem('D', 'Decode raw', 'Decode raw transaction', this.toRawTransactionInput.bind(this)),
      new MenuItem('R', 'Recent', 'Recent transactions'),
    ];
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
