// @flow

import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import RawTransactionInput from './RawTransactionInput';
import stack from './stack';

export default class TransactionsMenu extends MenuBase {
  constructor() {
    const options: MenuOption[] = [];
    options.push(new MenuOption('C', 'Create', 'Create new transaction'));
    options.push(new MenuOption('D', 'Decode', 'Decode raw transaction'));
    options.push(new MenuOption('R', 'Recent', 'Recent transactions'));
    super('Transactions', options);
  }

  handle(key: string) {
    switch (key.toUpperCase()) {
      case 'D':
        const input =  new RawTransactionInput();
        stack.push(input);
        break;
      default:
        super.handle(key);
    }
  }
}