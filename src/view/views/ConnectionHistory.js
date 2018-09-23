// @flow

import ViewBase from './ViewBase';
import List from '../components/List';
import type { ListColumn } from '../components/ListColumn';
import Menu from '../components/Menu';
import Connection from '../../model/Connection';

export default class ConnectionHistory extends ViewBase {
  _list: List
  _menu: Menu

  constructor() {
    super('Recent Connections');

    const history: Array<Array<string>> = Connection
      .getHistory()
      .map(rec => [rec.network, rec.host, rec.port.toString(), rec.cookieFile || rec.user]);

    const columns: Array<ListColumn> = [{
      width: 10,
    }, {
      width: 15,
    }, {
      width: 6,
    }, {
      width: 40,
    }];

    this._list = new List(columns, history);
    this._menu = new Menu();
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
