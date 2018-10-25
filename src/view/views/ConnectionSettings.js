// @flow

import FormView from 'tooey/lib/view/FormView';
import ViewBase from 'tooey/lib/view/ViewBase';
import Tab from 'tooey/lib/Tab';

import MainMenu from './MainMenu';
import state from '../../model/state';

const fieldIdx = {
  HOST: 0,
  PORT: 1,
  COOKIE: 2,
  USER: 3,
  PASSWORD: 4,
};

export default class ConnectionSettings extends ViewBase {
  _tab: Tab
  _formView: FormView

  constructor(tab: Tab) {
    super('Connection Settings');
    this._tab = tab;

    // Form fields
    const fields = [];
    fields[fieldIdx.HOST] = { label: 'Host', default: state.connection.host, type: 'string' };
    fields[fieldIdx.PORT] = { label: 'Port', default: state.connection.port.toString(), type: 'integer' };
    fields[fieldIdx.COOKIE] = { label: 'Cookie file', default: state.connection.cookieFile, type: 'string' };
    fields[fieldIdx.USER] = { label: 'User', default: state.connection.user, type: 'string' };
    fields[fieldIdx.PASSWORD] = { label: 'Password', default: state.connection.password, type: 'password' };

    // Menu items
    const menuItems = [{
      key: 'C',
      label: 'Connect',
      help: 'Connect to the node',
      execute: this.connect.bind(this),
    }];

    this._formView = new FormView(tab, fields, menuItems);
  }

  async connect() {
    try {
      // Update connection settings from form and connect
      const { fields } = this._formView.form;
      state.connection.host = fields[fieldIdx.HOST].input.value;
      state.connection.port = parseInt(fields[fieldIdx.PORT].input.value, 10);
      state.connection.cookieFile = fields[fieldIdx.COOKIE].input.value;
      state.connection.user = fields[fieldIdx.USER].input.value;
      state.connection.password = fields[fieldIdx.PASSWORD].input.value;
      await state.connection.connect();
      this._tab.stateMessage = state.connection.network.label;
      this._tab.pushView(new MainMenu(this._tab));
    } catch (err) {
      this._tab.setError(err.message);
    }
  }

  async handle(key: string): Promise<boolean> {
    return this._formView.handle(key);
  }

  render() {
    this._formView.render();
  }
}
