// @flow
import Network from 'cashlib/lib/Network';
import { abbreviateMiddle } from 'stringfu';
import List, { type ListColumn } from 'tooey/component/List';
import Menu, { type MenuItem } from 'tooey/component/Menu';
import ViewBase from 'tooey/view/ViewBase';
import Tab from 'tooey/Tab';
import output from 'tooey/output';

import Connection, { type ConnectionHistory as ModelHistory } from '../../model/Connection';
import ConnectionSettings from './ConnectionSettings';
import MainMenu from './MainMenu';
import NetworkSelection from './NetworkSelection';
import state from '../../model/state';

export default class ConnectionHistory extends ViewBase {
  _tab: Tab
  _list: List<ModelHistory>
  _menu: Menu
  _history: Array<ModelHistory>
  _connectItem: MenuItem

  constructor(tab: Tab) {
    super('Recent Connections');
    this._tab = tab;

    // Create menu
    this._connectItem = {
      key: 'C',
      label: 'Connect',
      help: 'Connect to selected network',
      execute: this.connectToSelected.bind(this),
    };
    this._menu = new Menu(tab, [
      this._connectItem,
      {
        key: 'E',
        label: 'Edit',
        help: 'Edit selected connection',
        execute: this.onEditConnection.bind(this),
      }, {
        key: 'N',
        label: 'New',
        help: 'Create new connection',
        execute: this.toNetworkSelection.bind(this),
      },
    ]);

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
      width: 20,
      value: (history) => {
        const host = `${history.host}:${history.port.toString()}`;
        return abbreviateMiddle(host, 20);
      },
    }, {
      heading: 'Authentication',
      width: 40,
      value: (history) => {
        debugger;
        const authValue = history.cookieFile
          || `${history.user}:${'*'.repeat(history.password.length)}`;
        return abbreviateMiddle(authValue, 40);
      },
    }];

    // Create list
    this._list = new List(tab, columns, this._history, {
      menu: this._menu,
      rowSelection: true,
      onSelect: this.onListSelect.bind(this),
    });
  }

  async onListSelect() {
    this._menu.setSelectedItem(this._connectItem);
  }

  async onEditConnection() {
    const history = this._history[this._list.selectedRowIndex];
    const network = Network.fromString(history.network);
    const connection = new Connection(network);
    connection.host = history.host;
    connection.port = history.port;
    connection.cookieFile = history.cookieFile;
    connection.user = history.user;
    connection.password = history.password;
    state.setConnection(this._tab, connection);
    this._tab.pushView(new ConnectionSettings(this._tab));
  }

  async toNetworkSelection() {
    this._tab.replaceView(new NetworkSelection(this._tab));
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
      state.setConnection(this._tab, connection);
      await connection.connect();
      this._tab.stateMessage = connection.network.label;
      this._list.items = Connection.getHistory();
      this._tab.pushView(new MainMenu(this._tab));
    } catch (err) {
      this._tab.setError(err.message);
    }
  }

  render() {
    // Render list first
    this._list.render();

    // If no history, render notice
    if (!this._list.items.length) {
      output.cursorTo(0, output.contentStartRow);
      console.log('No recent connections.');
    }

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
