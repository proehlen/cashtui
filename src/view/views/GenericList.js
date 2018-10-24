/* Generic single column list view with standard menu */
// @flow

import ViewBase from 'tooey/lib/ViewBase';
import List from 'tooey/lib/List';
import type { ListColumn } from 'tooey/lib/List';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
import Tab from 'tooey/lib/Tab';
import output from 'tooey/lib/output';

import GenericText from './GenericText';

export default class GenericList extends ViewBase {
  _tab: Tab
  _list: List<string>
  _menu: Menu
  _data: string[]

  constructor(tab: Tab, title: string, data: Array<string>, rowSelection?: boolean = false) {
    super(title);

    this._tab = tab;
    this._data = data;

    // Build menu
    const menuItems = [];
    if (rowSelection) {
      menuItems.push(
        new MenuItem('S', 'Show', 'Show details for selected row',
          this.toDetails.bind(this),
          this.isSelectedRowWiderThanOutput.bind(this)),
      );
    }
    this._menu = new Menu(tab, menuItems);

    // Build  list
    const columns: Array<ListColumn<string>> = [{
      heading: 'Result',
      width: 999,
      value: row => row,
    }];
    this._list = new List(tab, columns, data, {
      dataMapper: rec => [rec],
      showHeadings: false,
      menu: this._menu,
      rowSelection,
    });
  }

  async toDetails() {
    this._tab.pushView(new GenericText('Selected Row', this._getSelectedRowData()));
  }

  isSelectedRowWiderThanOutput() {
    return this._getSelectedRowData().length > output.width;
  }

  _getSelectedRowData(): string {
    let result = '';
    if (this._list && this._list.selectedRowIndex) {
      result = this._data[this._list.selectedRowIndex];
    }
    return result;
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
