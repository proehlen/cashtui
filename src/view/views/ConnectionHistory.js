// @flow
import List, { type ListColumn } from 'tooey/lib/List';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
import ViewBase from 'tooey/lib/ViewBase';
import Network from 'cashlib/lib/Network';

import Connection, { type History as ModelHistory } from '../../model/Connection';
import MainMenu from './MainMenu';
import NetworkSelection from './NetworkSelection';
import app from '../app';
import state from '../../model/state';

export default class ConnectionHistory extends ViewBase {
  _list: List<ModelHistory>
  _menu: Menu
  _history: Array<ModelHistory>
  _connectItem: MenuItem

  constructor() {
    super('Recent Connections');

    // Create menu
    this._connectItem = new MenuItem('C', 'Connect', 'Connect to selected network', this.connectToSelected.bind(this));
    this._menu = new Menu(app, [
      this._connectItem,
      new MenuItem('N', 'New', 'Create new connection', this.toNetworkSelection.bind(this)),
    ], false);

    // Get history
    this._history = Connection.getHistory();
    if (!this._history.length) {
      throw new Error('No recent connections found.');
    }

    // Create list columns
    const columns: Array<ListColumn<ModelHistory>> = [{
      heading: 'Network',
      width: 10,
      value: history => history.network,
    }, {
      heading: 'Host',
      width: 30,
      value: history => `${history.host}:${history.port.toString()}`,
    }, {
      heading: 'Authentication',
      width: 40,
      value: history => history.cookieFile
        || `${history.user}:${'*'.repeat(history.password.length)}`,
    }];

    // Create list
    this._list = new List(app, columns, this._history, {
      menu: this._menu,
      rowSelection: true,
      onSelect: this.onListSelect.bind(this),
    });
  }

  async onListSelect() {
    this._menu.setSelectedItem(this._connectItem.key);
  }

  async toNetworkSelection() {
    app.replaceView(new NetworkSelection());
  }

  async connectToSelected() {
    try {
      const selectedIndex = this._list.selectedRowIndex;
      const history = this._history[selectedIndex];
      const network = Network.fromString(history.network);
      const connection = new Connection(network);
      connection.host = history.host;
      connection.port = history.port;
      connection.cookieFile = history.cookieFile;
      connection.user = history.user;
      connection.password = history.password;
      state.connection = connection;
      await connection.connect();
      app.state = state.connection.network.label;
      this._list.setData(Connection.getHistory());
      app.pushView(new MainMenu());
    } catch (err) {
      app.setError(err.message);
    }
  }

  render() {
    // Render list first
    this._list.render();

    // Render menu last so cursor position is left in correct position
    this._menu.render(false);
  }

  async handle(key: string): Promise<boolean> {
    let handled = false;
    handled = await this._menu.handle(key);
    if (!handled) {
      handled = await this._list.handle(key);
    }
    return handled;
  }
}
