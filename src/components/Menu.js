// @flow
import colors from 'colors';
import cliui from 'cliui';

import Component from './Component';
import Option from '../Option';
import stack from '../stack';

const KEY_ESCAPE = String.fromCharCode(0x1b);

export default class Menu extends Component {
  _options: Option[]

  constructor(title: string, options: Option[]) {
    super(title);

    // Options specific to this menu
    this._options = options;

    // Every menu has to allow for quitting
    this._options.push(new Option('Q', 'Quit', 'Exit the program'));
  }

  render() {
    // Build options text
    const ui = cliui();
    let text = '';
    let options = this._options.map((option) => {
      debugger;
      const keyPosition = option.label.indexOf(option.key);
      const preKeyText = option.label.substring(0, keyPosition - 1);
      const postKeyText = option.label.substr(keyPosition + 1);
      return {
        text: colors.cyan(preKeyText) +
          colors.white.inverse(option.key) +
          colors.cyan(postKeyText),
        width: option.label.length + 2,
      }
    });
    ui.div(...options);

    console.log(ui.toString());
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