// @flow

import ViewBase from 'tooey/view/ViewBase';
import Menu from 'tooey/component/Menu';
import Tab from 'tooey/Tab';

import TransactionsMenu from './TransactionsMenu';
import RpcInput from './RpcInput';

export default class MainMenu extends ViewBase {
  _tab: Tab
  _menu: Menu

  constructor(tab: Tab) {
    super('Main Menu');
    this._tab = tab;
    this._menu = new Menu(tab, [{
      key: 'T',
      label: 'Transactions',
      help: 'Work with transactions',
      execute: this.toTransactions.bind(this),
    }, {
      key: 'R',
      label: 'RPC',
      help: 'Execute JSON RPC commands',
      execute: this.toRpc.bind(this),
    }]);
  }

  async toRpc() {
    this._tab.pushView(new RpcInput(this._tab));
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
