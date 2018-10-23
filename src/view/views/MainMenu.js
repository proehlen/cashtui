// @flow

import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
import Tab from 'tooey/lib/Tab';

import TransactionsMenu from './TransactionsMenu';
import RpcInput from './RpcInput';

export default class MainMenu extends ViewBase {
  _tab: Tab
  _menu: Menu

  constructor(tab: Tab) {
    super('Main Menu');
    this._tab = tab;
    this._menu = new Menu(tab, [
      new MenuItem('T', 'Transactions', 'Work with transactions', this.toTransactions.bind(this)),
      new MenuItem('R', 'RPC', 'Execute JSON RPC commands', this.toRpc.bind(this)),
    ]);
  }

  async toRpc() {
    this._tab.pushView(new RpcInput());
  }

  async toTransactions() {
    this._tab.pushView(new TransactionsMenu(this._tab));
  }

  render() {
    this._menu.render(false);
  }

  async handle(key: string): Promise<boolean> {
    return this._menu.handle(key);
  }
}
