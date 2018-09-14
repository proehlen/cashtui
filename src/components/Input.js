// @flow
import colors from 'colors';
import cliui from 'cliui';
import readline from 'readline';

import Component from './Component';
import stack from '../stack';

const KEY_ESCAPE = String.fromCharCode(0x1b);
const KEY_ENTER = String.fromCharCode(0x0d);

export default class Input extends Component {
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
        console.log('Done!');
        process.exit(0);
        break;
      case KEY_ESCAPE:
        stack.pop();
        break;
      default: 
        this._text += key;
        stack.render();
    }
  }
}