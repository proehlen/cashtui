// @flow

import ViewBase from './ViewBase';
import MainMenu from './MainMenu';
import Menu from '../components/Menu';
import MenuOption from '../components/MenuOption';
import Input from '../components/Input';
import output from '../output';
import state from '../../model/state';
import stack from '../stack';

import {
  KEY_TAB, KEY_SHIFT_TAB, KEY_LEFT, KEY_RIGHT, KEY_ESCAPE, KEY_UP, KEY_DOWN, KEY_ENTER,
} from '../keys';

const indexes = {
  HOST: 0,
  PORT: 1,
  COOKIE: 2,
  USER: 3,
  PASSWORD: 4,
};

declare type Field = {
  label: string,
  input: Input,
}

export default class ConnectionSettings extends ViewBase {
  _menu: Menu
  _fields: Array<Field>
  _selectedFieldIndex: number | void

  constructor() {
    super('Connection Settings');
    const menuOptions = [
      new MenuOption('C', 'Connect', 'Connect to the node', this.connect.bind(this)),
    ];
    this._fields = [];
    this._fields[indexes.HOST] = { label: 'Host', input: new Input(this._onEnter.bind(this), state.connection.host) };
    this._fields[indexes.PORT] = { label: 'Port', input: new Input(this._onEnter.bind(this), state.connection.port.toString()) };
    this._fields[indexes.COOKIE] = { label: 'Cookie file', input: new Input(this._onEnter.bind(this), state.connection.cookieFile) };
    this._fields[indexes.USER] = { label: 'User', input: new Input(this._onEnter.bind(this), state.connection.user) };
    this._fields[indexes.PASSWORD] = { label: 'Password', input: new Input(this._onEnter.bind(this), state.connection.password) };
    this._menu = new Menu(menuOptions);
  }

  async connect() {
    try {
      // Update connection settings from form and connect
      state.connection.host = this._fields[indexes.HOST].input.value;
      state.connection.port = parseInt(this._fields[indexes.PORT].input.value, 10);
      state.connection.cookieFile = this._fields[indexes.COOKIE].input.value;
      state.connection.user = this._fields[indexes.USER].input.value;
      state.connection.password = this._fields[indexes.PASSWORD].input.value;
      await state.connection.connect();
      stack.push(new MainMenu());
    } catch (err) {
      stack.setError(err.message);
    }
  }

  async _onEnter() {
    this.cycleSelectedField(1);
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
      case KEY_SHIFT_TAB:
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
            await selectedField.input.handle(key);
          }
        // } else if (key.toUpperCase() === 'C') {
        //   // Connect
        //   await this.connect();
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
    console.log(field.label);
    field.input.render(20, row, active);
  }

  render() {
    // Render inactive fields first
    for (let i = 0; i < this._fields.length; ++i) {
      const active = (i === this._selectedFieldIndex);
      if (!active) {
        this._renderField(i, active);
      }
    }

    // Render menu
    this._menu.render();

    // Render active field last (so cursor is left in correct position)
    if (this._selectedFieldIndex !== undefined) {
      this._renderField(this._selectedFieldIndex, true);
    }
  }
}
