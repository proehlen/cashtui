// @flow

import ComponentBase from './ComponentBase';
import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import InputBase from './InputBase';
import output from './output';
import state from '../model/state';

import { KEY_TAB, KEY_ESCAPE } from './keys';

export default class ConnectionSettings extends ComponentBase {
  _menu: MenuBase
  _fields: Array<InputBase>

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

  async handle(key: string) {
    if (key === KEY_TAB) {
      this._menu.active = !this._menu.active;
    } else if (!this._menu.active && key === KEY_ESCAPE) {
      this._menu.active = true;
    } else {
      await this._menu.handle(key);
    }
  }

  render() {
    for (let i = 0; i < this._fields.length; ++i) {
      const row = output.contentStartRow + i;
      output.cursorTo(0, row);
      const field = this._fields[i];
      console.log(field.title);
      field.render(20, row);
    }
    output.cursorTo(0, output.contentStartRow + this._fields.length);
    console.log('\nTab to switch between fields/menu');
    this._menu.render();
  }
}
