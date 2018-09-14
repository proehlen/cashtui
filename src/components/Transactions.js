// @flow

import Menu from './Menu';
import Option from '../Option';
import Input from './Input';
import stack from '../stack';

export default class Transactions extends Menu {
  constructor() {
    const options: Option[] = [];
    options.push(new Option('C', 'Create', 'Create new transaction'));
    options.push(new Option('D', 'Decode', 'Decode raw transaction'));
    options.push(new Option('B', 'Back', 'Go back to previous menu'));
    super('Transactions', options);
  }

  handle(key: string) {
    switch (key.toUpperCase()) {
      case 'C':
        // TODO something here
        break;
      case 'D':
        // TODO something here
        const input =  new Input('Enter raw transaction');
        stack.push(input);
        break;
      default:
        super.handle(key);
    }
  }
}