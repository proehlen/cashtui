// @flow

import Transaction from 'cashlib/lib/Transaction';
import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
import output from 'tooey/lib/output';

import state from '../../model/state';
import app from '../app';

export default class TransactionRaw extends ViewBase {
  _data: Array<string>
  _numPages: number
  _currentPage: number
  _menu: Menu

  constructor() {
    super('Raw Transaction');
    // Break raw transaction into pages.  Note: we can't use List as when the output is copied
    // to the clipboard it will contain a linebreak char for each line.
    const data = [];
    const tx: Transaction = state.transactions.active;
    const raw = tx.serialize();
    const charsPerPage = output.width * output.contentHeight;
    const numPages = Math.ceil(raw.length / charsPerPage);
    for (let x = 0; x < numPages; x++) {
      data.push(raw.substr(x * charsPerPage, charsPerPage));
    }

    const items: MenuItem[] = [];
    if (numPages) {
      items.push(new MenuItem('N', 'Next page', 'Go to next page', this.nextPage.bind(this)));
      items.push(new MenuItem('P', 'Previous page', 'Return to previous page', this.previousPage.bind(this)));
    }
    this._menu = new Menu(app.activeTab, items, true);
    this._data = data;
    this._currentPage = 1;
    this._numPages = numPages;
  }

  render() {
    // Render raw transaction
    // Just output continuous string - don't use cliui as
    // even with wrapping we get linebreak chars in output
    // which get copied to the clipboard when user copies
    // text
    output.cursorTo(0, output.contentStartRow);
    console.log(this._data[this._currentPage - 1]);

    // Render menu last for correct cursor positioning
    this._menu.render(false);
  }

  async nextPage() {
    if (this._currentPage === this._numPages) {
      app.setInfo('No more pages');
    } else {
      this._currentPage += 1;
    }
  }

  async previousPage() {
    if (this._currentPage === 1) {
      app.setInfo('Already at start');
    } else {
      this._currentPage -= 1;
    }
  }

  async handle(key: string): Promise<boolean> {
    return this._menu.handle(key);
  }
}
