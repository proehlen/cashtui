// @flow

import Menu from './Menu';
import MenuOption from './MenuOption';
import AbstractInput from './AbstractInput';
import stack from './stack';

export default class TransactionsMenu extends Menu {
  constructor() {
    const options: MenuOption[] = [];
    options.push(new MenuOption('C', 'Create', 'Create new transaction'));
    options.push(new MenuOption('D', 'Decode', 'Decode raw transaction'));
    options.push(new MenuOption('B', 'Back', 'Go back to previous menu'));
    super('Transactions', options);
  }

  handle(key: string) {
    switch (key.toUpperCase()) {
      case 'C':
        // TODO something here
        break;
      case 'D':
        // TODO something here
        const input =  new AbstractInput('Enter raw transaction');
        stack.push(input);
        break;
      default:
        super.handle(key);
    }
  }
}