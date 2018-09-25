// @flow

import ComponentBase from './ComponentBase';
import stack from '../stack';
import output from '../output';
import { KEY_ESCAPE, KEY_ENTER, KEY_BACKSPACE } from '../keys';

export default class Input extends ComponentBase {
  _value: string
  _onEnter: () => Promise<void>
  _isPassword: boolean

  constructor(onEnter: () => Promise<void>, initialValue: string = '', isPassword: boolean = false) {
    super();
    this._onEnter = onEnter;
    this._value = initialValue;
    this._isPassword = isPassword;
  }

  get value() { return this._value; }
  set value(value: string) { this._value = value; }

  render(atColumn: number = 0, atRow: number = output.contentStartRow, active: boolean = true) {
    // Output value
    const promptColumnWidth = 2;
    const valueColumnWidth = output.width - atColumn - promptColumnWidth;
    const rows = Math.trunc(this._value.length / valueColumnWidth) + 1;
    output.cursorTo(atColumn, atRow);
    for (let row = 0; row < rows; row++) {
      const prompt = active && row === 0 ? '> ' : '  ';
      let value = this.value.substr(row * valueColumnWidth, valueColumnWidth);
      if (this._isPassword) {
        value = '*'.repeat(value.length);
      }
      console.log(`${prompt}${value}`);
    }

    // Put cursor back to next char after last character output - ie where
    // the user will be typing next
    const cursorColumn = atColumn + (this._value.length % valueColumnWidth) + promptColumnWidth;
    const cursorRow = Math.trunc(this._value.length / valueColumnWidth) + atRow;
    output.cursorTo(cursorColumn, cursorRow);
  }

  async handle(key: string): Promise<void> {
    switch (key) {
      case KEY_BACKSPACE:
        this._value = this._value.substr(0, this._value.length - 1);
        break;
      case KEY_ENTER:
        await this._onEnter();
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
        if (key.length === 1 && key.charCodeAt(0) > 0x1F) {
          this._value += key;
        } else if (key.length > 4) {
          // Need to allow multiple chars for pasting - some of
          // these might not be printable however
          this._value += key;
        } else {
          // keys of length 2 to 4 are possibly arrow navigation and other
          // undesirable inputs that will screw up our input control so
          // ignore them.  It presently means that you can't paste
          // less than 5 chars into the input field.
        }
    }
  }
}
