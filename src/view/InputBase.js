// @flow
import colors from 'colors';
import cliui from 'cliui';
import readline from 'readline';

import ComponentBase from './ComponentBase';
import stack from './stack';

const KEY_ESCAPE = String.fromCharCode(0x1b);
const KEY_ENTER = String.fromCharCode(0x0d);
const KEY_BACKSPACE = String.fromCharCode(0x7f);

export default class InputBase extends ComponentBase {
  _text: string
  constructor(title:string) {
    super(title);
    this._text = '';
  }

  render() {
    // Build options text
    const ui = cliui();
    ui.div({
      text: '> ',
      width: 2
    }, {
      text: this._text
    });
    console.log(ui.toString());

    const columnWidth = ui.width - 2;
    const cursorColumn = (this._text.length % columnWidth ) + 2;
    const cursorRow = Math.trunc(this._text.length / columnWidth) + 1;
  
    readline.cursorTo(process.stdout, cursorColumn, cursorRow);
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
        stack.pop();
        break;
      default: 
        this._text += key;
    }
  }
  
  onEnter() {
    throw new Error('Method is abstract.  Override in subclass.')
  }
}