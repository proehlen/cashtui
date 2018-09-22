// @flow

import cliui from 'cliui';

import ComponentBase from './ComponentBase';
import stack from './stack';
import output from './output';
import { KEY_ESCAPE, KEY_ENTER, KEY_BACKSPACE } from './keys';

export default class InputBase extends ComponentBase {
  _value: string

  constructor(title: string, initialValue: string = '') {
    super(title);
    this._value = initialValue;
  }

  render(atColumn: number = 0, atRow: number = output.contentStartRow, active: boolean = true) {
    // Build options text
    const ui = cliui();
    output.cursorTo(atColumn, atRow);
    ui.div({
      text: active ? '> ' : ' ',
      width: 2,
    }, {
      text: this._value,
    });
    console.log(ui.toString());

    if (active) {
      const columnWidth = ui.width - 2;
      const cursorColumn = atColumn + (this._value.length % columnWidth) + 2;
      const cursorRow = Math.trunc(this._value.length / columnWidth) + atRow;
      output.cursorTo(cursorColumn, cursorRow);
    }
  }

  async handle(key: string): Promise<void> {
    switch (key) {
      case KEY_BACKSPACE:
        this._value = this._value.substr(0, this._value.length - 1);
        break;
      case KEY_ENTER:
        await this.onEnter();
        break;
      case KEY_ESCAPE:
        if (this._value.length) {
          this._value = '';
        } else {
          stack.pop();
        }
        break;
      default:
        // Add printable chars to input text - ignore all other
        // special chars (e.g. unprintable arrow keys etc)
        // that haven't been handled by this point.
        // TODO handle range beyond extended ASCII - ie UTF?
        if (key.length === 1 && key.charCodeAt(0) > 0x31) {
          this._value += key;
        }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onEnter() {
    throw new Error('Method is abstract.  Override in subclass.');
  }
}
