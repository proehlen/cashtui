/* Generic single column list view with standard menu */
// @flow

import ViewBase from 'tooey/lib/ViewBase';
import List from 'tooey/lib/List';
import type { ListColumn } from 'tooey/lib/List';
import Menu from 'tooey/lib/Menu';
import app from '../app';

export default class GenericList extends ViewBase {
  _list: List<string>
  _menu: Menu

  constructor(title: string, data: Array<string>) {
    super(title);

    this._menu = new Menu(app.activeTab);

    const columns: Array<ListColumn<string>> = [{
      heading: 'Result',
      width: 999,
      value: row => row,
    }];
    this._list = new List(app.activeTab, columns, data, {
      dataMapper: rec => [rec],
      showHeadings: false,
      menu: this._menu,
    });
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
