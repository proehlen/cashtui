// @flow
import colors from 'colors';
import cliui from 'cliui';
import readline from 'readline';

import AbstractComponent from './AbstractComponent';
import stack from './stack';

const KEY_ESCAPE = String.fromCharCode(0x1b);
const KEY_ENTER = String.fromCharCode(0x0d);

export default class AbstractInput extends AbstractComponent {
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

  handle(key: string) {
    switch (key) {
      case KEY_ENTER:
        this.onEnter();
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