// @flow

import colors from 'colors';
import cliui from 'cliui';

import ComponentBase from './ComponentBase';
import MenuOption from './MenuOption';
import stack from '../stack';
import output from '../output';
import {
  KEY_ENTER, KEY_ESCAPE, KEY_LEFT, KEY_RIGHT,
} from '../keys';

const OPTION_GAP = 3; // Render gap between options

export default class Menu extends ComponentBase {
  _options: MenuOption[]
  _active: boolean
  _selectedIndex: number
  _hasBack: boolean

  constructor(options?: MenuOption[] = [], allowBackOption: boolean = true) {
    super();

    this._active = true;
    this._options = [];

    // Every menu has to allow for quitting
    this.addOption(new MenuOption('Q', 'Quit', 'Exit the program'));

    // Most menus have (B)ack option
    if (allowBackOption) {
      this.addOption(new MenuOption('B', 'Back', 'Go back to previous menu'), 'start');
      this._hasBack = true;
    } else {
      this._hasBack = false;
    }

    // Add options specific to this menu
    options.reverse().forEach(option => this.addOption(option, 'start'));

    // Set active/default  action
    this._selectedIndex = 0;
    const option = this._options[this._selectedIndex];
    stack.setInfo(option.help);
  }

  render() {
    // Build options text
    output.cursorTo(0, 1);
    const ui = cliui();
    const text = this._options.reduce((acc, option, index) => {
      const separator = index > 0 ? ` ${String.fromCharCode(183)} ` : '';
      const preKeyText = (option.keyPosition) ? option.label.substring(0, option.keyPosition) : '';
      const postKeyText = option.label.substr(option.keyPosition + 1);
      const keyText = this._active
        ? colors.bold(option.key)
        : option.key;
      return `${acc}${separator}${preKeyText}${keyText}${postKeyText}`;
    }, '');
    ui.div(text);

    console.log(ui.toString());
    if (this._active) {
      this._cursorToselectedOption();
    }
  }

  addOption(option: MenuOption, position: 'start' | 'end' = 'end') {
    if (this._options.findIndex(existing => existing.key === option.key) > -1) {
      throw new Error(`Cannot create menu with duplicate key '${option.key}'`);
    }

    if (position === 'start') {
      this._options.unshift(option);
    } else {
      const insertAt = this._hasBack
        ? this._options.length - 2 // before Back
        : this._options.length - 1; // before Quit
      this._options.splice(insertAt, 0, option);
    }
  }

  get selectedIndex() { return this._selectedIndex; }
  set selectedIndex(index: number) { this._selectedIndex = index; }
  get selectedOption() { return this._options[this._selectedIndex]; }
  get options() { return this._options; }

  get active() { return this._active; }
  set active(active: boolean) {
    const option = this._options[this._selectedIndex];
    stack.setInfo(option.help);
    this._active = active;
  }

  cycleSelectedOption(direction: 1 | -1) {
    this._selectedIndex += direction;

    if (this._selectedIndex < 0) {
      this._selectedIndex = this._options.length - 1;
    } else if (this._selectedIndex >= this._options.length) {
      this._selectedIndex = 0;
    }

    const option = this._options[this._selectedIndex];
    stack.setInfo(option.help);
  }

  _cursorToselectedOption() {
    let x = 0;
    for (let i = 0; i < this._selectedIndex; i++) {
      const option = this._options[i];
      x += (option.label.length + OPTION_GAP);
    }
    const selectedOption = this._options[this._selectedIndex];
    output.cursorTo(x + selectedOption.keyPosition, 1);
  }


  async handle(key: string): Promise<void> {
    if (this._active) {
      if (key === KEY_ENTER) {
        // Call back this method (maybe in child class) with key
        // for active option
        const option = this._options[this._selectedIndex];
        await this.handle(option.key);
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
            this.cycleSelectedOption(-1);
            break;
          case KEY_RIGHT:
            this.cycleSelectedOption(1);
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
              if (option.execute) {
                await option.execute();
              } else {
                // Valid option
                stack.setWarning(`Sorry, the '${option.label}' feature is not implemented yet`);
              }
            }
            break;
          }
        }
      }
    }
  }
}
