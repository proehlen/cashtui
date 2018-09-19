// @flow

import colors from 'colors';
import cliui from 'cliui';

import ComponentBase from './ComponentBase';
import MenuOption from './MenuOption';
import stack from './stack';
import output from './output';
import {
  KEY_ENTER, KEY_ESCAPE, KEY_LEFT, KEY_RIGHT,
} from './keys';

const OPTION_GAP = 3; // Render gap between options

export default class MenuBase extends ComponentBase {
  _options: MenuOption[]

  _activeOption: number

  constructor(title: string, options?: MenuOption[] = [], allowBackOption: boolean = true) {
    super(title);

    // Options specific to this menu
    this._options = options;

    // Most menus have (B)ack option
    if (allowBackOption) {
      this._options.push(new MenuOption('B', 'Back', 'Go back to previous menu'));
    }

    // Every menu has to allow for quitting
    this._options.push(new MenuOption('Q', 'Quit', 'Exit the program'));

    // Set active/default  action
    this._activeOption = 0;
    const option = this._options[this._activeOption];
    stack.setInfo(option.help);
  }

  render() {
    // Build options text
    output.cursorTo(0, 1);
    const ui = cliui();
    const text = this._options.reduce((acc, option, index) => {
      const separator = index > 0 ? ` ${String.fromCharCode(183)} ` : '';
      const keyPosition = option.label.indexOf(option.key);
      const preKeyText = (keyPosition) ? option.label.substring(0, keyPosition - 1) : '';
      const postKeyText = option.label.substr(keyPosition + 1);
      return `${acc}${separator}${preKeyText}${colors.bold(option.key)}${postKeyText}`;
    }, '');
    ui.div(text);

    console.log(ui.toString());
    this._cursorToActiveOption();
  }

  get activeOption() {
    return this._options[this._activeOption];
  }

  _cursorToActiveOption() {
    let x = 0;
    for (let i = 0; i < this._activeOption; i++) {
      const option = this._options[i];
      x += (option.label.length + OPTION_GAP);
    }
    output.cursorTo(x, 1);
  }

  _cycleActiveOption(direction: 1 | -1) {
    this._activeOption += direction;

    if (this._activeOption < 0) {
      this._activeOption = this._options.length - 1;
    } else if (this._activeOption >= this._options.length) {
      this._activeOption = 0;
    }

    const option = this._options[this._activeOption];
    stack.setInfo(option.help);
  }

  async handle(key: string): Promise<void> {
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
          this._cycleActiveOption(-1);
          break;
        case KEY_RIGHT:
          this._cycleActiveOption(1);
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
        default: {
          const option = this._options.find(candidate => candidate.key === key.toUpperCase());
          if (option) {
            // Valid option
            stack.setWarning(`Sorry, the '${option.label}' feature is not implemented yet`);
          } else {
            stack.setWarning('Invaid option');
          }
          break;
        }
      }
    }
  }
}
