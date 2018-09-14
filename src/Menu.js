// @flow
import  colors from 'colors';
import clear from 'clear-console';
import Option from './Option';
import stack from './stack';

const KEY_ESCAPE = String.fromCharCode(0x1b);

export default class Menu {
  _title: string
  _options: Option[]

  constructor(title: string, options: Option[]) {
    this._title = title;

    // Options specific to this menu
    this._options = options;

    // Every menu has to allow for quitting
    this._options.push(new Option('Q', 'Quit', 'Exit the program'));
  }

  render() {
    // Build options text
    let text = colors.black(`${this._title}: `);
    for (let i = 0; i < this._options.length; ++i) {
      const option = this._options[i];
      const keyPosition = option.label.indexOf(option.key);
      const preKeyText = option.label.substring(0, keyPosition - 1);
      const postKeyText = option.label.substr(keyPosition + 1);
      text = text + 
        colors.black(preKeyText) +
        colors.bold.black.inverse(option.key) +
        colors.black(postKeyText) +
        ' ';
    }

    console.log(colors.bgWhite(text));
  }

  handle(key: string) {
    switch (key.toUpperCase()) {
      case KEY_ESCAPE:
        if (stack.depth) {
          stack.pop();
        } else {
          stack.quit();
        }
        break;
      case 'B':
        // Back
        if (stack.depth) {
          stack.pop();
        }
        break;
      case 'Q':
        // Quit
        stack.quit();
        break;
    }
  }
}