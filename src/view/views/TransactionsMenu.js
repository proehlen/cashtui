// @flow

import { Transaction } from 'cashlib';

import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
import RawTransactionInput from './RawTransactionInput';
import TransactionIdInput from './TransactionIdInput';
import app from '../app';
import state from '../../model/state';
import TransactionHeader from './TransactionHeader';

export default class TransactionsMenu extends ViewBase {
  _menu: Menu

  constructor() {
    super('Transactions');

    const items: MenuItem[] = [
      new MenuItem('I', 'By Id', 'Retrieve transaction from full node', this.toTransactionIdInput.bind(this)),
      new MenuItem('C', 'Create', 'Create new transaction', this.createTransaction.bind(this)),
      new MenuItem('D', 'Decode raw', 'Decode raw transaction', this.toRawTransactionInput.bind(this)),
      new MenuItem('R', 'Recent', 'Recent transactions'),
    ];
    this._menu = new Menu(app, items);
  }

  async toTransactionIdInput() {
    app.pushView(new TransactionIdInput());
  }

  async createTransaction() {
    state.transactions.active = new Transaction();
    app.pushView(new TransactionHeader());
  }

  async toRawTransactionInput() {
    app.pushView(new RawTransactionInput());
  }

  async handle(key: string): Promise<void> {
    this._menu.handle(key);
  }

  render() {
    this._menu.render(false);
  }
}
