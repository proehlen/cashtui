/* Generic single column list view with standard menu */
// @flow

import ViewBase from '../components/ViewBase';
import List from '../components/List';
import type { ListColumn } from '../components/List';
import Menu from '../components/Menu';

export default class GenericList extends ViewBase {
  _list: List
  _menu: Menu

  constructor(title: string, data: Array<string>) {
    super(title);

    this._menu = new Menu();

    // Transform data (array of strings) into format for List control
    // Single column in Array of Array of strings
    const listData: Array<Array<string>> = data
      .map(rec => [rec]);
    const columns: Array<ListColumn> = [{ heading: 'Result', width: 999 }];
    this._list = new List(columns, listData, false, this._menu);
  }

  render() {
    // Render list first
    this._list.render();

    // Render menu last so cursor position is left in correct position
    this._menu.render(false);
  }

  async handle(key: string) {
    await this._menu.handle(key);
    await this._list.handle(key);
  }
}
