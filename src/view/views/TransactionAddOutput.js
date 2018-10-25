// @flow

import ViewBase from 'tooey/lib/view/ViewBase';
import Menu, { type MenuItem } from 'tooey/lib/component/Menu';
import Tab from 'tooey/lib/Tab';

import TransactionAddOutputP2PKH from './TransactionAddOutputP2PKH';

export default class TransactionAddOutput extends ViewBase {
  _tab: Tab
  _menu: Menu

  constructor(tab: Tab) {
    super('Add Output');
    this._tab = tab;

    const menuItems: MenuItem[] = [{
      key: 'H',
      label: 'Add P2PKH',
      help: 'Add new Pay To Public Key Hash output',
      execute: async () => tab.pushView(new TransactionAddOutputP2PKH()),
    }, {
      key: 'K', label: 'Add P2PK', help: 'Add new Pay To Public Key output',
    }, {
      key: 'S', label: 'Add P2SH', help: 'Add new Pay To Script Hash output',
    }];
    this._menu = new Menu(tab, menuItems);
  }

  render() {
    this._menu.render(false);
  }

  async handle(key: string): Promise<boolean> {
    return this._menu.handle(key);
  }
}
