// @flow

import cliui from 'cliui';

import ComponentBase from './ComponentBase';
import stack from './stack';
import output from './output';
import { KEY_ESCAPE, KEY_ENTER, KEY_BACKSPACE } from './keys';

export default class InputBase extends ComponentBase {
  _text: string

  constructor(title: string, initialValue: string = '') {
    super(title);
    this._text = initialValue;
  }

  render(atColumn: number = 0, atRow: number = output.contentStartRow) {
    // Build options text
    const ui = cliui();
    output.cursorTo(atColumn, atRow);
    ui.div({
      text: '> ',
      width: 2,
    }, {
      text: this._text,
    });
    console.log(ui.toString());

    const columnWidth = ui.width - 2;
    const cursorColumn = atColumn + (this._text.length % columnWidth) + 2;
    const cursorRow = Math.trunc(this._text.length / columnWidth) + atRow;

    output.cursorTo(cursorColumn, cursorRow);
  }

  async handle(key: string): Promise<void> {
    switch (key) {
      case KEY_BACKSPACE:
        this._text = this._text.substr(0, this._text.length - 1);
        break;
      case KEY_ENTER:
        await this.onEnter();
        break;
      case KEY_ESCAPE:
        if (this._text.length) {
          this._text = '';
        } else {
          stack.pop();
        }
        break;
      default:
        // Add alphanumeric chars to input text - ignore all other
        // special chars (e.g. unprintable arrow keys etc)
        // that haven't been handled by this point.
        // TODO - add support for euro/other accents etc?
        if (/^[ a-z0-9]+$/i.test(key)) {
          this._text += key;
        }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onEnter() {
    throw new Error('Method is abstract.  Override in subclass.');
  }
}
