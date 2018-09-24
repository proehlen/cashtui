// @flow

import ViewBase from './ViewBase';
import List from '../components/List';
import type { ListColumn } from '../components/List';
import Menu from '../components/Menu';

export default class RpcOutputList extends ViewBase {
  _list: List
  _menu: Menu

  constructor(rpcResult: Array<string>) {
    super('RPC Result');

    this._menu = new Menu();

    // RPC results are a single column list
    const listData: Array<Array<string>> = rpcResult
      .map(rec => [rec]);
    const columns: Array<ListColumn> = [{ heading: 'Result', width: 999 }];
    this._list = new List(columns, listData, false, this._menu);
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
