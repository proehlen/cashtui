// @flow

import ComponentBase from './ComponentBase';
import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import InputBase from './InputBase';
import output from './output';
import state from '../model/state';

import {
  KEY_TAB, KEY_LEFT, KEY_RIGHT, KEY_ESCAPE, KEY_UP, KEY_DOWN, KEY_ENTER,
} from './keys';

export default class ConnectionSettings extends ComponentBase {
  _menu: MenuBase
  _fields: Array<InputBase>
  _selectedFieldIndex: number | void

  constructor() {
    super('Connection Settings');
    const menuOptions = [
      new MenuOption('C', 'Connect', 'Connect to the node'),
    ];
    this._fields = [
      new InputBase('Host', state.connection.host),
      new InputBase('Port', state.connection.port.toString()),
      new InputBase('Cookie file', state.connection.cookieFile),
      new InputBase('User', state.connection.user),
      new InputBase('Password', state.connection.password),
    ];
    this._menu = new MenuBase('Connection Settings', menuOptions);
  }


  cycleSelectedField(direction: 1 | -1) {
    if (this._selectedFieldIndex === undefined) {
      // No current field selected
      if (direction === 1) {
        // Select first field
        this._selectedFieldIndex = 0;
      } else {
        // Select last field
        this._selectedFieldIndex = this._fields.length - 1;
      }
    } else {
      // Go to previous/next field
      this._selectedFieldIndex += direction;
      if (this._selectedFieldIndex < 0) {
        // No more previous fields - cycle to last menu option
        this._selectedFieldIndex = undefined;
        this._menu.active = true;
        this._menu.selectedIndex = this._menu.options.length - 1;
      } else if (this._selectedFieldIndex >= this._fields.length) {
        // No more next fields - cycle to first menu option
        this._selectedFieldIndex = undefined;
        this._menu.active = true;
        this._menu.selectedIndex = 0;
      }
    }
  }

  async handle(key: string) {
    switch (key) {
      case KEY_UP:
        this.cycleSelectedField(-1);
        break;
      case KEY_DOWN:
        this.cycleSelectedField(1);
        break;
      case KEY_LEFT:
        if (this._menu.active) {
          if (this._menu.selectedIndex > 0) {
            // Cycle to previous menu option
            this._menu.cycleSelectedOption(-1);
          } else {
            // No more menu options, cycle to previous (last) field
            this._menu.active = false;
            this._selectedFieldIndex = this._fields.length - 1;
          }
        } else {
          // Field active, go to previous field
          this.cycleSelectedField(-1);
        }
        break;
      case KEY_RIGHT:
      case KEY_TAB:
        if (this._menu.active) {
          if (this._menu.selectedIndex < (this._menu.options.length - 1)) {
            // Cycle to next menu option
            this._menu.cycleSelectedOption(1);
          } else {
            // No more menu options, cycle to next (first) field
            this._menu.active = false;
            this._selectedFieldIndex = 0;
          }
        } else {
          // Field active, go to next field
          this.cycleSelectedField(1);
        }
        break;
      default:
        if (this._selectedFieldIndex !== undefined) {
          const selectedField = this._fields[this._selectedFieldIndex];
          if (key === KEY_ESCAPE) {
            // Escape on selected field should return to menu (first option)
            this._menu.active = true;
            this._menu.selectedIndex = 0;
            this._selectedFieldIndex = undefined;
          } else if (key === KEY_ENTER) {
            // Enter on selected field should go to next field
            this.cycleSelectedField(1);
          } else {
            await selectedField.handle(key);
          }
        } else {
          await this._menu.handle(key);
        }
        break;
    }
  }

  _renderField(index: number, active: boolean) {
    const row = output.contentStartRow + index;
    output.cursorTo(0, row);
    const field = this._fields[index];
    console.log(field.title);
    field.render(20, row, active);
  }

  render() {
    // Render inactive fields first
    for (let i = 0; i < this._fields.length; ++i) {
      const active = (i === this._selectedFieldIndex);
      if (!active) {
        this._renderField(i, active);
      }
    }
    // output.cursorTo(0, output.contentStartRow + this._fields.length);
    // console.log('\nTab to switch between fields/menu');

    // Render menu
    this._menu.render();

    // Render active field last (so cursor is left in correct position)
    if (this._selectedFieldIndex !== undefined) {
      this._renderField(this._selectedFieldIndex, true);
    }
  }
}
