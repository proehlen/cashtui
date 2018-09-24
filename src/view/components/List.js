// @flow
import colors from 'colors';

// $flow-disable-line stringFixedWidth is definitely available
import { stringFixedWidth } from 'my-bitcoin-cash-lib/lib/string';

import ComponentBase from './ComponentBase';
import Menu from './Menu';
import MenuOption from './MenuOption';
import output from '../output';
import stack from '../stack';

import {
  KEY_PAGE_DOWN, KEY_PAGE_UP, KEY_DOWN, KEY_UP, KEY_ENTER,
} from '../keys';

export type ListColumn = {
  heading: string,
  width: number,
}

export default class List extends ComponentBase {
  _startIndex: number
  _data: Array<Array<string>>
  _columns: Array<ListColumn>
  _showHeadings: boolean
  _onEnter: (number) => Promise<void>
  _selectedPageRow: number

  constructor(
    columns: Array<ListColumn>,
    data: Array<Array<string>>,
    showHeadings: boolean = true,
    menu?: Menu,
    onEnter?: (number) => Promise<void>,
  ) {
    super();
    this._columns = columns;
    this._data = data;
    this._showHeadings = showHeadings;
    this._startIndex = 0;
    this._selectedPageRow = 0;
    if (onEnter) {
      this._onEnter = onEnter;
    }
    if (menu) {
      // Add paging to menu
      menu.addOption(new MenuOption('N', 'Next page', 'Go to next page', this.pageDown.bind(this)));
      menu.addOption(new MenuOption('P', 'Previous page', 'Return to previous page', this.pageUp.bind(this)));
    }
  }

  render() {
    // Column headings
    if (this._showHeadings) {
      output.cursorTo(0, output.contentStartRow - 1);
      const reduceHeadingsToString = (accumulator, column): string => {
        const colText = stringFixedWidth(column.heading, column.width);
        return `${accumulator || ''}${colText} `;
      };
      const heading = this._columns.reduce(reduceHeadingsToString, '');
      console.log(colors.bgBlue.white(heading));
    }

    // Data for current page
    output.cursorTo(0, output.contentStartRow);
    const reduceColsToString = (accumulator, colData, index): string => {
      const column = this._columns[index];
      const colText = stringFixedWidth(colData, column.width);
      return `${accumulator || ''}${colText} `;
    };
    this._data
      .slice(this._startIndex, this._startIndex + output.contentHeight)
      .map(cols => cols.reduce(reduceColsToString, ''))
      .forEach((text, index) => {
        const outputText = text.substr(0, output.width);
        if (this._onEnter && index === this._selectedPageRow) {
          // onEnter callback signifies rows are selectable so
          // highlight selected row
          console.log(colors.inverse(outputText));
        } else {
          console.log(outputText);
        }
      });
  }

  async pageUp() {
    if (this._startIndex === 0) {
      stack.setInfo('Already at start');
      return;
    }
    this._startIndex -= output.contentHeight;
    this._selectedPageRow = output.contentHeight - 1;
    if (this._startIndex < 0) {
      this._startIndex = 0;
    }
  }

  get selectedRowIndex() {
    return this._startIndex + this._selectedPageRow;
  }

  _currentPage(): number {
    return Math.ceil((this._startIndex + 1) / output.contentHeight);
  }

  _numberPages(): number {
    return Math.floor(this._data.length / output.contentHeight) + 1;
  }

  _isLastPage(): boolean {
    return this._currentPage() >= this._numberPages();
  }

  async pageDown() {
    if ((this._startIndex + output.contentHeight) > this._data.length) {
      stack.setInfo('No more pages');
      return;
    }
    this._startIndex += output.contentHeight;
    this._selectedPageRow = 0;
    if (this._startIndex >= (this._data.length)) {
      this._startIndex = this._data.length - 1;
    }
  }

  async selectPrevious() {
    if (this._selectedPageRow === 0) {
      await this.pageUp();
    } else {
      this._selectedPageRow--;
    }
  }

  async selectNext() {
    const isLastPage = this._isLastPage();
    const lastPageRowIndex = (this._data.length % output.contentHeight) - 1;
    if (!isLastPage && this._selectedPageRow >= output.contentHeight - 1) {
      await this.pageDown();
    } else if (isLastPage && this._selectedPageRow < lastPageRowIndex) {
      this._selectedPageRow++;
    } else if (!isLastPage) {
      this._selectedPageRow++;
    } else {
      stack.setInfo('No more records');
    }
  }

  async handle(key: string) {
    switch (key) {
      case KEY_ENTER:
        if (this._onEnter) {
          await this._onEnter(this.selectedRowIndex);
        }
        break;
      case KEY_DOWN:
        if (this._onEnter) {
          await this.selectNext();
        }
        break;
      case KEY_UP:
        if (this._onEnter) {
          await this.selectPrevious();
        }
        break;
      case KEY_PAGE_DOWN:
        await this.pageDown();
        break;
      case KEY_PAGE_UP:
        await this.pageUp();
        break;
      default:
        // Don't handle here
    }
  }
}
