// @flow

import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import TransactionsMenu from './TransactionsMenu';
import RpcInput from './RpcInput';
import stack from './stack';

export default class MainMenu extends MenuBase {
  constructor() {
    const options: MenuOption[] = [];
    options.push(new MenuOption('T', 'Transactions', 'Work with transactions'));
    options.push(new MenuOption('R', 'RPC', 'Execute JSON RPC commands'));
    super('Main Menu', options, false);
  }

  handle(key: string) {
    switch (key.toUpperCase()) {
      case 'R':
        stack.push(new RpcInput());
        break;
      case 'T':
        stack.push(new TransactionsMenu());
        break;
      default:
        super.handle(key);
    }
  }
}