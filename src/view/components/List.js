// @flow
import cliui from 'cliui';

import type { ListColumn } from './ListColumn';
import ComponentBase from './ComponentBase';
import output from '../output';

import { KEY_PAGE_DOWN, KEY_PAGE_UP } from '../keys';

export default class List extends ComponentBase {
  _startIndex: number
  _data: Array<Array<string>>
  _columns: Array<ListColumn>

  constructor(columns: Array<ListColumn>, data: Array<Array<string>>) {
    super();
    this._columns = columns;
    this._data = data;
    this._startIndex = 0;
  }

  render() {
    const ui = cliui({
      wrap: false,
    });
    output.cursorTo(0, output.contentStartRow);
    const colToDiv = (col, index) => {
      const column = this._columns[index];
      const merged: any = {
        text: col,
      };
      if (column.width) merged.width = column.width;
      if (column.align) merged.align = column.align;
      return merged;
    };
    this._data
      .slice(this._startIndex, this._startIndex + output.contentHeight)
      .map(cols => cols.map(colToDiv))
      .forEach(cols => ui.div(...cols));

    console.log(ui.toString());
  }

  pageUp() {
    this._startIndex += output.contentHeight;
    if (this._startIndex >= (this._data.length)) {
      this._startIndex = this._data.length - 1;
    }
  }

  pageDown() {
    this._startIndex -= output.contentHeight;
    if (this._startIndex < 0) {
      this._startIndex = 0;
    }
  }

  async handle(key: string) {
    switch (key) {
      case KEY_PAGE_DOWN:
        this.pageDown();
        break;
      case KEY_PAGE_UP:
        this.pageUp();
        break;
      default:
        // Don't handle here
    }
  }
}
