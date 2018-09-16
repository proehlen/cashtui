// @flow
import colors from 'colors';
import cliui from 'cliui';
import readline from 'readline';

import ComponentBase from './ComponentBase';
import MenuOption from './MenuOption';
import stack from './stack';

const KEY_ENTER = String.fromCharCode(0x0d);
const KEY_ESCAPE = String.fromCharCode(0x1b);
const KEY_LEFT = String.fromCharCode(0x1b, 0x5b, 0x44);
const KEY_RIGHT = String.fromCharCode(0x1b, 0x5b, 0x43);
const OPTION_GAP = 2; // Render gap between options

export default class MenuBase extends ComponentBase {
  _options: MenuOption[]
  _activeOption: number

  constructor(title: string, options: MenuOption[], allowBackOption: boolean = true) {
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
    readline.cursorTo(process.stdout,0,1);
    const ui = cliui();
    let text = '';
    let options = this._options.map((option) => {
      const keyPosition = option.label.indexOf(option.key);
      const preKeyText = option.label.substring(0, keyPosition - 1);
      const postKeyText = option.label.substr(keyPosition + 1);
      return {
        text: preKeyText + colors.bold(option.key) + postKeyText,
        width: option.label.length + OPTION_GAP,
      }
    });
    ui.div(...options);

    console.log(ui.toString());
    this._moveCursorToActiveOption();
  }

  get activeOption() {
    return this._options[this._activeOption];
  }
  
  _moveCursorToActiveOption() {
    let x = 0;
    for (let i = 0; i < this._activeOption; i++) {
      const option = this._options[i];
      x += (option.label.length + OPTION_GAP);
    }
    readline.cursorTo(process.stdout, x, 1);
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
        default:
          const option = this._options.find(option => option.key === key.toUpperCase());
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