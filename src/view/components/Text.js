// @flow

import ComponentBase from './ComponentBase';
import output from './output';
import app from '../app';

import {
  KEY_DOWN, KEY_UP, KEY_PAGE_DOWN, KEY_PAGE_UP,
} from './keys';

export default class List extends ComponentBase {
  _text: string
  _page: number

  constructor(
    text: string,
  ) {
    super();
    this._text = text;
    this._page = 1;
  }

  render() {
    // Render text for current page
    const startAt = (this._page - 1) * this._numCharsPage;
    const pageText = this._text.substr(startAt, this._numCharsPage);
    output.cursorTo(0, output.contentStartRow);
    console.log(pageText);
  }

  async pageUp() {
    if (this._page === 1) {
      app.setInfo('Already at start');
      return;
    }
    this._page--;
  }

  get _numCharsPage() {
    return output.width * output.contentHeight;
  }

  get _pageCount() {
    return Math.ceil(this._text.length / this._numCharsPage);
  }

  async pageDown() {
    if (this._page >= this._pageCount) {
      app.setInfo('No more pages');
      return;
    }
    this._page++;
  }

  async handle(key: string) {
    switch (key) {
      case KEY_DOWN:
      case KEY_PAGE_DOWN:
        await this.pageDown();
        break;
      case KEY_UP:
      case KEY_PAGE_UP:
        await this.pageUp();
        break;
      default:
        // Don't handle here
    }
  }
}
