// @flow

import Transaction from 'my-bitcoin-cash-lib/lib/Transaction';

import ListBase from './ListBase';
import state from '../model/state';
import output from './output';

export default class TransactionRaw extends ListBase {
  constructor() {
    const data = [];
    // Break raw transaction over lines that fit output width
    // TODO - handle window resizing
    const tx: Transaction = state.transactions.active;
    const raw = tx.hex;
    const rows = Math.ceil(raw.length / output.width);
    for (let x = 0; x < rows; x++) {
      data.push(raw.substr(x * output.width, output.width));
    }
    super(data, 'Raw Transaction');
  }

  render() {
    output.cursorTo(0, output.contentStartRow);
    super.render();
  }
}
