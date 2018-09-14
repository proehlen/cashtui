// @flow

import Menu from './Menu';
import MenuOption from './MenuOption';
import TransactionsMenu from './TransactionsMenu';
import stack from './stack';

export default class Main extends Menu {
  constructor() {
    const options: MenuOption[] = [];
    options.push(new MenuOption('T', 'Transactions', 'Work with transactions'));
    super('Main Menu', options);
  }

  handle(key: string) {
    switch (key.toUpperCase()) {
      case 'T':
        stack.push(new TransactionsMenu());
        break;
      default:
        super.handle(key);
    }
  }
}