// @flow

import ViewBase from 'tooey/view/ViewBase';
import Menu, { type MenuItem } from 'tooey/component/Menu';
import Tab from 'tooey/Tab';
import List, { type ListColumn } from 'tooey/component/List';

export type UnspentOutputsItem = {
  txid: string,
  vout: number,
  address: string,
  amount: number,
}

export default class UnspentOutputs extends ViewBase {
  _onSelect: ?(UnspentOutputsItem) => Promise<void>
  _items: UnspentOutputsItem[]
  _menu: Menu
  _list: List<UnspentOutputsItem>

  constructor(
    tab: Tab,
    title: string,
    items: UnspentOutputsItem[],
    onSelect?: (UnspentOutputsItem) => Promise<void>,
  ) {
    super(title);

    this._items = items;
    this._onSelect = onSelect;

    // Build menu items
    const menuItems: MenuItem[] = [];
    if (onSelect) {
      menuItems.push({
        key: 'O',
        label: 'Ok',
        help: 'Continue with selected UTXO',
        execute: this.onOk.bind(this),
      });
    }

    // Build menu
    this._menu = new Menu(tab, menuItems);

    // Build list columns
    const columns: Array<ListColumn<UnspentOutputsItem>> = [{
      heading: 'Amount',
      width: 14,
      value: item => item.amount.toFixed(8),
    }, {
      heading: 'Transaction Id',
      width: 64,
      value: item => item.txid,
    }, {
      heading: 'Output',
      width: 6,
      value: item => item.vout.toString(),
    }, {
      heading: 'Address',
      width: 34,
      value: item => item.address,
    }];

    // Build list
    this._list = new List(tab, columns, items, {
      menu: this._menu,
      rowSelection: true,
    });
  }

  async onOk(): Promise<void> {
    if (this._onSelect) {
      const selected = this._items[this._list.selectedRowIndex];
      await this._onSelect(selected);
    }
  }

  render() {
    this._list.render();
    this._menu.render(false);
  }

  async handle(key: string): Promise<boolean> {
    let handled = await this._menu.handle(key);
    if (!handled) {
      handled = await this._list.handle(key);
    }
    return handled;
  }
}
