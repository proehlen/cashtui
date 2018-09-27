// @flow

import ViewBase from './ViewBase';
import ComponentBase from '../components/ComponentBase';
import MainMenu from './MainMenu';
import Form from '../components/Form';
import Menu from '../components/Menu';
import MenuOption from '../components/MenuOption';
import state from '../../model/state';
import stack from '../stack';

import {
  KEY_UP, KEY_DOWN,
} from '../keys';

const fieldIdx = {
  HOST: 0,
  PORT: 1,
  COOKIE: 2,
  USER: 3,
  PASSWORD: 4,
};

export default class ConnectionSettings extends ViewBase {
  _menu: Menu
  _form: Form
  _activeComponent: ComponentBase

  constructor() {
    super('Connection Settings');

    // Build form
    const fields = [];
    fields[fieldIdx.HOST] = { label: 'Host', default: state.connection.host, password: false };
    fields[fieldIdx.PORT] = { label: 'Port', default: state.connection.port.toString(), password: false };
    fields[fieldIdx.COOKIE] = { label: 'Cookie file', default: state.connection.cookieFile, password: false };
    fields[fieldIdx.USER] = { label: 'User', default: state.connection.user, password: false };
    fields[fieldIdx.PASSWORD] = { label: 'Password', default: state.connection.password, password: true };
    this._form = new Form(
      fields,
      this.onNoMoreFields.bind(this),
      this.onEscapeFromField.bind(this),
    );

    // Build menu
    const menuOptions = [
      new MenuOption('C', 'Connect', 'Connect to the node', this.connect.bind(this)),
    ];
    this._menu = new Menu(menuOptions, true, this.onNoMoreOptions.bind(this));

    // Start with menu active
    this._activeComponent = this._menu;
  }

  async onNoMoreOptions(direction: number) {
    this._activeComponent = this._form;
    if (direction > 0) {
      this._form.setFirstFieldSelected();
    } else {
      this._form.setLastFieldSelected();
    }
  }

  async onNoMoreFields(direction: number) {
    this._activeComponent = this._menu;
    if (direction > 0) {
      this._menu.setFirstOptionSelected();
    } else {
      this._menu.setLastOptionSelected();
    }
  }

  async onEscapeFromField() {
    this._activeComponent = this._menu;
  }

  async connect() {
    try {
      // Update connection settings from form and connect
      const { fields } = this._form;
      state.connection.host = fields[fieldIdx.HOST].input.value;
      state.connection.port = parseInt(fields[fieldIdx.PORT].input.value, 10);
      state.connection.cookieFile = fields[fieldIdx.COOKIE].input.value;
      state.connection.user = fields[fieldIdx.USER].input.value;
      state.connection.password = fields[fieldIdx.PASSWORD].input.value;
      await state.connection.connect();
      stack.push(new MainMenu());
    } catch (err) {
      stack.setError(err.message);
    }
  }

  async handle(key: string) {
    if ((key === KEY_DOWN || key === KEY_UP) && this._activeComponent === this._menu) {
      // Menu doesn't respond to arrow up/down - in this view
      // we will use it to shift to form if menu is active
      this._activeComponent = this._form;
      this._form.setFirstFieldSelected();
    } else {
      await this._activeComponent.handle(key);
    }
  }

  render() {
    // Render components in proper order for cursor positioning
    if (this._activeComponent === this._menu) {
      this._form.render();
      this._menu.render(false);
    } else {
      this._menu.render(true);
      this._form.render();
    }
  }
}
