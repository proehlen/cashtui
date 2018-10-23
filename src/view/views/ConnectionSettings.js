// @flow

import MenuForm from 'tooey/lib/MenuForm';
import ViewBase from 'tooey/lib/ViewBase';
import MenuItem from 'tooey/lib/MenuItem';

import MainMenu from './MainMenu';
import state from '../../model/state';
import app from '../app';

const fieldIdx = {
  HOST: 0,
  PORT: 1,
  COOKIE: 2,
  USER: 3,
  PASSWORD: 4,
};

export default class ConnectionSettings extends ViewBase {
  _menuForm: MenuForm

  constructor() {
    super('Connection Settings');

    // Form fields
    const fields = [];
    fields[fieldIdx.HOST] = { label: 'Host', default: state.connection.host, type: 'string' };
    fields[fieldIdx.PORT] = { label: 'Port', default: state.connection.port.toString(), type: 'integer' };
    fields[fieldIdx.COOKIE] = { label: 'Cookie file', default: state.connection.cookieFile, type: 'string' };
    fields[fieldIdx.USER] = { label: 'User', default: state.connection.user, type: 'string' };
    fields[fieldIdx.PASSWORD] = { label: 'Password', default: state.connection.password, type: 'password' };

    // Menu items
    const menuItems = [
      new MenuItem('C', 'Connect', 'Connect to the node', this.connect.bind(this)),
    ];

    this._menuForm = new MenuForm(app, fields, menuItems);
  }

  async connect() {
    try {
      // Update connection settings from form and connect
      const { fields } = this._menuForm.form;
      state.connection.host = fields[fieldIdx.HOST].input.value;
      state.connection.port = parseInt(fields[fieldIdx.PORT].input.value, 10);
      state.connection.cookieFile = fields[fieldIdx.COOKIE].input.value;
      state.connection.user = fields[fieldIdx.USER].input.value;
      state.connection.password = fields[fieldIdx.PASSWORD].input.value;
      await state.connection.connect();
      app.state = state.connection.network.label;
      app.pushView(new MainMenu());
    } catch (err) {
      app.setError(err.message);
    }
  }

  async handle(key: string): Promise<boolean> {
    return this._menuForm.handle(key);
  }

  render() {
    this._menuForm.render();
  }
}
