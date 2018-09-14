// @flow

import Menu from './Menu';
import MenuOption from './MenuOption';

export default class TransactionMenu extends Menu {
  constructor () {
    const options: MenuOption[] = [];
    options.push(new MenuOption('I', 'Inputs', 'Transaction inputs'));
    options.push(new MenuOption('O', 'Outputs', 'Transaction outputs'));
    options.push(new MenuOption('B', 'Back', 'Go back to previous menu'));
    super('Transaction', options);
  }
}