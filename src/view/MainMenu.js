// @flow

import Menu from './Menu';
import MenuOption from './MenuOption';
import TransactionsMenu from './TransactionsMenu';
import stack from './stack';

export default class Main extends Menu {
  constructor() {
    const options: MenuOption[] = [];
    options.push(new MenuOption('T', 'Transactions', 'Work with transactions'));
    options.push(new MenuOption('R', 'RPC', 'Execute JSON RPC commands'));
    super('Main Menu', options, false);
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