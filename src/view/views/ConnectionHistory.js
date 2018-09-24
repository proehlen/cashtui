// @flow
import Network from 'my-bitcoin-cash-lib/lib/Network';

import MainMenu from './MainMenu';
import ViewBase from './ViewBase';
import List from '../components/List';
import type { ListColumn } from '../components/ListColumn';
import Menu from '../components/Menu';
import Connection, { type History as ModelHistory } from '../../model/Connection';
import stack from '../stack';
import state from '../../model/state';

export default class ConnectionHistory extends ViewBase {
  _list: List
  _menu: Menu
  _history: Array<ModelHistory>

  constructor() {
    super('Recent Connections');

    this._menu = new Menu();

    this._history = Connection.getHistory();

    const listData: Array<Array<string>> = this._history
      .map(rec => [rec.network, `${rec.host}:${rec.port.toString()}`, rec.cookieFile || `${rec.user}:<password>`]);

    const columns: Array<ListColumn> = [{
      heading: 'Network',
      width: 10,
    }, {
      heading: 'Host',
      width: 30,
    }, {
      heading: 'Auth',
      width: 40,
    }];

    this._list = new List(columns, listData, true, this._menu, this.onSelection.bind(this));
  }

  async onSelection(historyIndex: number) {
    try {
      debugger;
      const history = this._history[historyIndex];
      const network = Network.fromString(history.network);
      const connection = new Connection(network);
      connection.host = history.host;
      connection.port = history.port;
      connection.cookieFile = history.cookieFile;
      connection.user = history.user;
      connection.password = history.password;
      state.connection = connection;
      await connection.connect();
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
