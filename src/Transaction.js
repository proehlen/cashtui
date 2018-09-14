// @flow

import Menu from './Menu';
import Option from './Option';
import stack from './stack';

export default class Transaction extends Menu {
  constructor() {
    const options: Option[] = [];
    options.push(new Option('C', 'Create', 'Create new transaction'));
    options.push(new Option('B', 'Back', 'Go back to previous menu'));
    super('Transaction', options);
  }

  handle(key: string) {
    // TODO - handle C
    switch (key.toUpperCase()) {
      case 'C':
        // do something here
        break;
      default:
        super.handle(key);
    }
  }
}