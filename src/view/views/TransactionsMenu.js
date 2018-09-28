// @flow

import { Transaction } from 'cashlib';

import ViewBase from '../components/ViewBase';
import Menu from '../components/Menu';
import MenuOption from '../components/MenuOption';
import RawTransactionInput from './RawTransactionInput';
import TransactionIdInput from './TransactionIdInput';
import stack from '../stack';
import state from '../../model/state';
import TransactionHeader from './TransactionHeader';

export default class TransactionsMenu extends ViewBase {
  _menu: Menu

  constructor() {
    super('Transactions');

    const options: MenuOption[] = [
      new MenuOption('I', 'By Id', 'Retrieve transaction from full node', this.toTransactionIdInput.bind(this)),
      new MenuOption('C', 'Create', 'Create new transaction', this.createTransaction.bind(this)),
      new MenuOption('D', 'Decode raw', 'Decode raw transaction', this.toRawTransactionInput.bind(this)),
      new MenuOption('R', 'Recent', 'Recent transactions'),
    ];
    this._menu = new Menu(options);
  }

  async toTransactionIdInput() {
    stack.push(new TransactionIdInput());
  }

  async createTransaction() {
    state.transactions.active = new Transaction();
    stack.push(new TransactionHeader());
  }

  async toRawTransactionInput() {
    stack.push(new RawTransactionInput());
  }

  async handle(key: string): Promise<void> {
    this._menu.handle(key);
  }

  render() {
    this._menu.render(false);
  }
}
