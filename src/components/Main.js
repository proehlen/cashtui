// @flow

import Menu from './Menu';
import Option from '../Option';
import Transactions from './Transactions';
import stack from '../stack';

export default class Main extends Menu {
  constructor() {
    const options: Option[] = [];
    options.push(new Option('T', 'Transactions', 'Work with transactions'));
    super('Main Menu', options);
  }

  handle(key: string) {
    switch (key.toUpperCase()) {
      case 'T':
        stack.push(new Transactions());
        break;
      default:
        super.handle(key);
    }
  }
}