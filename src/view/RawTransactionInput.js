// @flow
import AbstractInput from './AbstractInput';
import TransactionMenu from './TransactionMenu';
import stack from './stack';

export default class RawTransactionInput extends AbstractInput {
  onEnter() {
    // TODO set active transaction in model
    stack.replace(new TransactionMenu());
  }
}