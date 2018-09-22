// @flow

import ViewBase from './ViewBase';
import Menu from '../components/Menu';
import MenuOption from '../components/MenuOption';
import TransactionsMenu from './TransactionsMenu';
import RpcInput from './RpcInput';
import stack from '../stack';

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
    stack.push(new RpcInput());
  }

  async toTransactions() {
    stack.push(new TransactionsMenu());
  }

  render() {
    this._menu.render();
  }

  async handle(key: string): Promise<void> {
    this._menu.handle(key);
  }
}
