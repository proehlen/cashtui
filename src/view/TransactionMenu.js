// @flow

import MenuBase from './MenuBase';
import MenuOption from './MenuOption';

export default class TransactionMenu extends MenuBase {
  constructor () {
    const options: MenuOption[] = [];
    options.push(new MenuOption('I', 'Inputs', 'Transaction inputs'));
    options.push(new MenuOption('O', 'Outputs', 'Transaction outputs'));
    options.push(new MenuOption('L', 'Label', 'Label this transaction'));
    super('Transaction', options);
  }
}