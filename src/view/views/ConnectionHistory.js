// @flow
import Network from 'cashlib/lib/Network';

import Connection, { type History as ModelHistory } from '../../model/Connection';
import List from '../components/List';
import type { ListColumn } from '../components/List';
import MainMenu from './MainMenu';
import Menu from '../components/Menu';
import MenuOption from '../components/MenuOption';
import NetworkSelection from './NetworkSelection';
import stack from '../stack';
import state from '../../model/state';
import ViewBase from './ViewBase';

export default class ConnectionHistory extends ViewBase {
  _list: List
  _menu: Menu
  _history: Array<ModelHistory>
  _connectOption: MenuOption

  constructor() {
    super('Recent Connections');

    this._connectOption = new MenuOption('C', 'Connect', 'Connect to selected network', this.connectToSelected.bind(this));
    this._menu = new Menu([
      this._connectOption,
      new MenuOption('N', 'New', 'Create new connection', this.toNetworkSelection.bind(this)),
    ], false);

    const listData = this._getListData();
    if (!listData.length) {
      throw new Error('No recent connections found.');
    }

    const columns: Array<ListColumn> = [{
      heading: 'Network',
      width: 10,
    }, {
      heading: 'Host',
      width: 30,
    }, {
      heading: 'Authentication',
      width: 40,
    }];

    this._list = new List(columns, listData, true, this._menu, true, this.onListSelect.bind(this));
  }

  async onListSelect() {
    this._menu.setSelectedOption(this._connectOption.key);
  }

  async toNetworkSelection() {
    stack.replace(new NetworkSelection());
  }

  _getListData(): Array<Array<string>> {
    this._history = Connection.getHistory();
    return this._history
      .map(rec => [
        rec.network,
        `${rec.host}:${rec.port.toString()}`,
        rec.cookieFile || `${rec.user}:${'*'.repeat(rec.password.length)}`,
      ]);
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
      this._list.setData(this._getListData());
      stack.push(new MainMenu());
    } catch (err) {
      stack.setError(err.message);
    }
  }

  render() {
    // Render list first
    this._list.render();

    // Render menu last so cursor position is left in correct position
    this._menu.render();
  }

  async handle(key: string) {
    await this._menu.handle(key);
    await this._list.handle(key);
  }
}
