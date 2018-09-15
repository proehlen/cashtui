// @flow
import InputBase from './InputBase';
import TransactionMenu from './TransactionMenu';
import stack from './stack';

export default class RawTransactionInput extends InputBase {
  constructor() {
    super('Enter raw transaction');
  }
 onEnter() {
    // TODO set active transaction in model
    stack.replace(new TransactionMenu());
  }
}