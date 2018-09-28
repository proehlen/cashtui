// @flow

import ViewBase from '../components/ViewBase';
import Menu from '../components/Menu';
import MenuOption from '../components/MenuOption';
import TransactionsMenu from './TransactionsMenu';
import RpcInput from './RpcInput';
import app from '../app';

export default class MainMenu extends ViewBase {
  _menu: Menu

  constructor() {
    super('Main Menu');
    this._menu = new Menu([
      new MenuOption('T', 'Transactions', 'Work with transactions', this.toTransactions.bind(this)),
      new MenuOption('R', 'RPC', 'Execute JSON RPC commands', this.toRpc.bind(this)),
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

  async handle(key: string): Promise<void> {
    this._menu.handle(key);
  }
}
