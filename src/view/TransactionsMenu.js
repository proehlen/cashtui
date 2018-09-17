// @flow

import { Transaction } from 'my-bitcoin-cash-lib';

import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import RawTransactionInput from './RawTransactionInput';
import stack from './stack';
import state from '../model/state';
import TransactionMenu from './TransactionMenu';

export default class TransactionsMenu extends MenuBase {
  constructor() {
    const options: MenuOption[] = [];
    options.push(new MenuOption('C', 'Create', 'Create new transaction'));
    options.push(new MenuOption('D', 'Decode', 'Decode raw transaction'));
    options.push(new MenuOption('R', 'Recent', 'Recent transactions'));
    super('Transactions', options);
  }

  async handle(key: string): Promise<void> {
    switch (key.toUpperCase()) {
      case 'C':
        state.transactions.active = new Transaction();
        stack.push(new TransactionMenu());
        break;
      case 'D':
        stack.push(new RawTransactionInput());
        break;
      default:
        super.handle(key);
    }
  }
}
