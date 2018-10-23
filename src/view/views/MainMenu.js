// @flow

import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
import TransactionsMenu from './TransactionsMenu';
import RpcInput from './RpcInput';
import app from '../app';

export default class MainMenu extends ViewBase {
  _menu: Menu

  constructor() {
    super('Main Menu');
    this._menu = new Menu(app, [
      new MenuItem('T', 'Transactions', 'Work with transactions', this.toTransactions.bind(this)),
      new MenuItem('R', 'RPC', 'Execute JSON RPC commands', this.toRpc.bind(this)),
    ]);
  }

  async toRpc() {
    app.pushView(new RpcInput());
  }

  async toTransactions() {
    app.pushView(new TransactionsMenu());
  }

  render() {
    this._menu.render(false);
  }

  async handle(key: string): Promise<boolean> {
    return this._menu.handle(key);
  }
}
