// @flow
import colors from 'colors';
import cliui from 'cliui';
import readline from 'readline';

import AbstractComponent from './AbstractComponent';
import MenuOption from './MenuOption';
import stack from './stack';

const KEY_ENTER = String.fromCharCode(0x0d);
const KEY_ESCAPE = String.fromCharCode(0x1b);
const KEY_LEFT = String.fromCharCode(0x1b, 0x5b, 0x44);
const KEY_RIGHT = String.fromCharCode(0x1b, 0x5b, 0x43);
const OPTION_GAP = 2; // Render gap between options

export default class Menu extends AbstractComponent {
  _options: MenuOption[]
  _activeOption: number

  constructor(title: string, options: MenuOption[]) {
    super(title);

    // Options specific to this menu
    this._options = options;

    // Every menu has to allow for quitting
    this._options.push(new MenuOption('Q', 'Quit', 'Exit the program'));

    this._activeOption = 0;
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
          colors.cyan.bold(option.key) +
          colors.cyan(postKeyText),
        width: option.label.length + OPTION_GAP,
      }
    });
    ui.div(...options);

    console.log(ui.toString());
    this._moveCursorToActiveOption();
  }
  
  _moveCursorToActiveOption() {
    let x = 0;
    for (let i = 0; i < this._activeOption; i++) {
      const option = this._options[i];
      x += (option.label.length + OPTION_GAP);
    }
    readline.cursorTo(process.stdout, x, 1);
  }

  handle(key: string) {
    if (key === KEY_ENTER) {
      // Call back this method (maybe in child class) with key
      // for active option
      const option = this._options[this._activeOption];
      this.handle(option.key);
    } else {
      switch (key.toUpperCase()) {
        case KEY_ESCAPE:
          if (stack.depth) {
            stack.pop();
          } else {
            stack.quit();
          }
          break;
        case KEY_LEFT: 
          this._activeOption -= 1;
          if (this._activeOption < 0) {
            this._activeOption = this._options.length - 1;
          }
          stack.render();
          break;
        case KEY_RIGHT: 
          this._activeOption += 1;
          if (this._activeOption >= this._options.length) {
            this._activeOption = 0;
          }
          stack.render();
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
}