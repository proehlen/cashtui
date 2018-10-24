// @flow

import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
import Tab from 'tooey/lib/Tab';

import TransactionAddOutputP2PKH from './TransactionAddOutputP2PKH';

export default class TransactionAddOutput extends ViewBase {
  _tab: Tab
  _menu: Menu

  constructor(tab: Tab) {
    super('Add Output');
    this._tab = tab;

    const menuItems = [
      new MenuItem('H', 'Add P2PKH', 'Add new Pay To Public Key Hash output',
        async () => tab.pushView(new TransactionAddOutputP2PKH())),
      new MenuItem('K', 'Add P2PK', 'Add new Pay To Public Key output'),
      new MenuItem('S', 'Add P2SH', 'Add new Pay To Script Hash output'),
    ];
    this._menu = new Menu(tab, menuItems);
  }

  render() {
    this._menu.render(false);
  }

  async handle(key: string): Promise<boolean> {
    return this._menu.handle(key);
  }
}
