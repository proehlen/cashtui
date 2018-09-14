// @flow

import Menu from './Menu';
import Option from '../Option';
import Transaction from './Transaction';
import stack from '../stack';

export default class Main extends Menu {
  constructor() {
    const options: Option[] = [];
    options.push(new Option('T', 'Transaction', 'Work with transactions'));
    super('Main Menu', options);
  }

  handle(key: string) {
    switch (key.toUpperCase()) {
      case 'T':
        stack.push(new Transaction());
        break;
      default:
        super.handle(key);
    }
  }
}