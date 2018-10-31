// @flow

import Network from 'cashlib/lib/Network';
import ViewBase from 'tooey/view/ViewBase';
import List, { type ListColumn } from 'tooey/component/List';
import Menu, { type MenuItem } from 'tooey/component/Menu';
import Tab from 'tooey/Tab';

import Connection from '../../model/Connection';
import ConnectionSettings from './ConnectionSettings';
import ConnectionHistory from './ConnectionHistory';
import state from '../../model/state';

export default class NetworkSelection extends ViewBase {
  _tab: Tab
  _networks: Array<string>
  _menu: Menu
  _list: List<string>
  _continueItem: MenuItem

  constructor(tab: Tab) {
    super('Connect to node');
    this._tab = tab;

    // Build menu
    this._continueItem = {
      key: 'C',
      label: 'Continue',
      help: 'Connect to Network',
      execute: this.toConnectionSettings.bind(this),
    };
    const menuItems = [
      this._continueItem,
      {
        key: 'R',
        label: 'Recent',
        help: 'Recent connections',
        execute: this.toConnectionHistory.bind(this),
      },
    ];
    this._menu = new Menu(tab, menuItems);

    // Build networks list
    this._networks = [
      'mainnet',
      'testnet',
      'regtest',
      'nol',
    ];

    const columns: Array<ListColumn<string>> = [{
      heading: 'Network',
      width: 25,
      value: network => network,
    }];
    this._list = new List(tab, columns, this._networks, {
      showHeadings: false,
      rowSelection: true,
      onSelect: this.onListSelect.bind(this),
    });
  }

  async onListSelect() {
    this._menu.setSelectedItem(this._continueItem);
  }

  render() {
    // Render network list
    this._list.render();

    // Render menu last (for correct cursor positioning)
    this._menu.render(false);
  }

  get _selectedNetwork(): string {
    const selectedIndex = this._list.selectedRowIndex;
    return this._networks[selectedIndex];
  }

  async toConnectionSettings() {
    try {
      const networkLabel = this._selectedNetwork;
      if (networkLabel === 'mainnet') {
        // Disallow mainnet connections until we have resolved all of
        // the security issues (passwords are currently stored in plain text
        // and we will need to store private keys for tx signing). Also
        // immaturity of cashlib just creates to much risk.
        throw new Error('Sorry, mainnet connections are not secure/supported yet');
      }
      const network = Network.fromString(networkLabel);
      const connection = new Connection(network);
      state.connection = connection;
      this._tab.pushView(new ConnectionSettings(this._tab));
    } catch (err) {
      this._tab.setError(err.message);
    }
  }

  async toConnectionHistory() {
    try {
      this._tab.replaceView(new ConnectionHistory(this._tab));
    } catch (err) {
      this._tab.setError(err.message);
    }
  }

  async handle(key: string): Promise<boolean> {
    let handled = await this._menu.handle(key);
    if (!handled) {
      handled = await this._list.handle(key);
    }
    return handled;
  }
}
