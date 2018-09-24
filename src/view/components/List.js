// @flow
import colors from 'colors';

import { stringFixedWidth } from 'my-bitcoin-cash-lib/lib/string';

import type { ListColumn } from './ListColumn';
import ComponentBase from './ComponentBase';
import Menu from './Menu';
import MenuOption from './MenuOption';
import output from '../output';
import stack from '../stack';

import { KEY_PAGE_DOWN, KEY_PAGE_UP } from '../keys';

export default class List extends ComponentBase {
  _startIndex: number
  _data: Array<Array<string>>
  _columns: Array<ListColumn>
  _showHeadings: boolean
  _onEnter: () => Promise<void>

  constructor(
    columns: Array<ListColumn>,
    data: Array<Array<string>>,
    showHeadings: boolean = true,
    menu?: Menu,
    onEnter?: () => Promise<void>,
  ) {
    super();
    this._columns = columns;
    this._data = data;
    this._showHeadings = showHeadings;
    this._startIndex = 0;
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
    if (this._showHeadings) {
      output.cursorTo(0, output.contentStartRow - 1);
      const reduceHeadingsToString = (accumulator, column): string => {
        const colText = stringFixedWidth(column.heading, column.width);
        return `${accumulator || ''}${colText} `;
      };
      const heading = this._columns.reduce(reduceHeadingsToString, '');
      console.log(colors.bgBlue.white(heading));
    }

    output.cursorTo(0, output.contentStartRow);
    const reduceColsToString = (accumulator, colData, index): string => {
      const column = this._columns[index];
      const colText = stringFixedWidth(colData, column.width);
      return `${accumulator || ''}${colText} `;
    };
    this._data
      .slice(this._startIndex, this._startIndex + output.contentHeight)
      .map(cols => cols.reduce(reduceColsToString, ''))
      .forEach(cols => console.log(cols.substr(0, output.width)));
  }

  async pageUp() {
    if (this._startIndex === 0) {
      stack.setInfo('Already at start');
      return;
    }
    this._startIndex -= output.contentHeight;
    if (this._startIndex < 0) {
      this._startIndex = 0;
    }
  }

  async pageDown() {
    if ((this._startIndex + output.contentHeight) > this._data.length) {
      stack.setInfo('No more pages');
      return;
    }
    this._startIndex += output.contentHeight;
    if (this._startIndex >= (this._data.length)) {
      this._startIndex = this._data.length - 1;
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
