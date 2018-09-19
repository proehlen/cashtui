// @flow

import Transaction from 'my-bitcoin-cash-lib/lib/Transaction';

import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import state from '../model/state';
import stack from './stack';
import output from './output';

export default class TransactionRaw extends MenuBase {
  _data: Array<string>
  _numPages: number
  _currentPage: number

  constructor() {
    // Break raw transaction into pages.  Note: we can't use ListBase as when the output is copied
    // to the clipboard it will contain a linebreak char for each line.
    const data = [];
    const tx: Transaction = state.transactions.active;
    const raw = tx.hex;
    const charsPerPage = output.width * output.contentHeight;
    const numPages = Math.ceil(raw.length / charsPerPage);
    for (let x = 0; x < numPages; x++) {
      data.push(raw.substr(x * charsPerPage, charsPerPage));
    }

    const options: MenuOption[] = [];
    if (numPages) {
      options.push(new MenuOption('N', 'Next page', 'Go to next page'));
      options.push(new MenuOption('P', 'Previous page', 'Return to previous page'));
    }
    super('Raw Transaction', options, true);
    this._data = data;
    this._currentPage = 1;
    this._numPages = numPages;
  }

  render() {
    output.cursorTo(0, output.contentStartRow);
    // Just output continuous string - don't use cliui as
    // even with wrapping we get linebreak chars in output
    // which get copied to the clipboard when user copies
    // text
    console.log(this._data[this._currentPage - 1]);
    super.render();
  }

  async handle(key: string): Promise<void> {
    switch (key.toUpperCase()) {
      case 'P': {
        if (this._currentPage === 1) {
          stack.setInfo('Already at start');
        } else {
          this._currentPage -= 1;
        }
        break;
      }
      case 'N': {
        if (this._currentPage === this._numPages) {
          stack.setInfo('No more pages');
        } else {
          this._currentPage += 1;
        }
        break;
      }
      default:
        await super.handle(key);
    }
  }
}
