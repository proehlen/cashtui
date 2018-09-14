// @flow
import AbstractInput from './AbstractInput';
import TransactionMenu from './TransactionMenu';
import stack from './stack';

export default class RawTransactionInput extends AbstractInput {
  onEnter() {
    stack.replace(new TransactionMenu());
  }
}