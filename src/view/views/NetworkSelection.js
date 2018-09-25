// @flow

import Network from 'my-bitcoin-cash-lib/lib/Network';

import ViewBase from './ViewBase';
import Connection from '../../model/Connection';
import List from '../components/List';
import Menu from '../components/Menu';
import MenuOption from '../components/MenuOption';
import ConnectionSettings from './ConnectionSettings';
import ConnectionHistory from './ConnectionHistory';
import state from '../../model/state';
import stack from '../stack';

export default class NetworkSelection extends ViewBase {
  _networks: Array<Array<string>>
  _menu: Menu
  _list: List
  _continueOption: MenuOption

  constructor() {
    super('Connect to node');

    // Build menu
    this._continueOption = new MenuOption('C', 'Continue', 'Connect to Network', this.toConnectionSettings.bind(this));
    const menuOptions = [
      this._continueOption,
      new MenuOption('R', 'Recent', 'Recent connections', this.toConnectionHistory.bind(this)),
    ];
    this._menu = new Menu(menuOptions, false);

    // Build networks list
    this._networks = [
      ['mainnet'],
      ['testnet'],
      ['regtest'],
      ['nol'],
    ];
    this._list = new List(
      [{
        heading: 'Network',
        width: 25,
      }],
      this._networks,
      false,
      undefined,
      true,
      this.onListSelect.bind(this),
    );
  }

  async onListSelect() {
    this._menu.setSelectedOption(this._continueOption.key);
  }

  render() {
    // Render network list
    this._list.render();

    // Render menu last (for correct cursor positioning)
    this._menu.render();
  }

  get _selectedNetwork(): string {
    const selectedIndex = this._list.selectedRowIndex;
    return this._networks[selectedIndex][0];
  }

  async toConnectionSettings() {
    try {
      const networkLabel = this._selectedNetwork;
      const network = Network.fromString(networkLabel);
      const connection = new Connection(network);
      state.connection = connection;
      stack.push(new ConnectionSettings());
    } catch (err) {
      stack.setError(err.message);
    }
  }

  async toConnectionHistory() {
    try {
      stack.replace(new ConnectionHistory());
    } catch (err) {
      stack.setError(err.message);
    }
  }

  async handle(key: string) {
    await this._menu.handle(key);
    await this._list.handle(key);
  }
}
