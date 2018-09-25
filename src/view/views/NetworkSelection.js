// @flow

import cliui from 'cliui';
import colors from 'colors';
import Network from 'my-bitcoin-cash-lib/lib/Network';

import ViewBase from './ViewBase';
import Connection from '../../model/Connection';
import Menu from '../components/Menu';
import MenuOption from '../components/MenuOption';
import ConnectionSettings from './ConnectionSettings';
import ConnectionHistory from './ConnectionHistory';
import output from '../output';
import state from '../../model/state';
import stack from '../stack';
import { KEY_UP, KEY_DOWN } from '../keys';

export default class NetworkSelection extends ViewBase {
  _networks: Array<string>
  _selectedNetwork: number
  _menu: Menu

  constructor() {
    super('Connect to node');
    const menuOptions = [
      new MenuOption('C', 'Continue', 'Connect to Network', this.toConnectionSettings.bind(this)),
      new MenuOption('R', 'Recent', 'Recent connections', this.toConnectionHistory.bind(this)),
    ];
    this._menu = new Menu(menuOptions, false);
    this._networks = [
      'mainnet',
      'testnet',
      'regtest',
      'nol',
    ];
    this._selectedNetwork = 0;
  }

  render() {
    // Render network list
    const ui = cliui();
    output.cursorTo(0, output.contentStartRow);
    for (let i = 0; i < this._networks.length; ++i) {
      const option = this._networks[i];
      const selected = i === this._selectedNetwork;
      const selector = ` ${selected ? '>' : ' '} `;
      const optionText = selected && this._menu.selectedOption.key === 'C'
        ? colors.bold(option)
        : option;
      ui.div({
        text: selector,
        width: 2,
      }, {
        text: optionText,
      });
    }
    ui.div({ text: '' });
    ui.div({
      text: 'Use up/down arrows to select network type',
    });
    console.log(ui.toString());

    // Render menu last (for correct cursor positioning)
    this._menu.render();
  }

  async toConnectionSettings() {
    try {
      const networkLabel = this._networks[this._selectedNetwork];
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
    switch (key.toUpperCase()) {
      case KEY_DOWN:
        this._selectedNetwork++;
        if (this._selectedNetwork >= this._networks.length) {
          this._selectedNetwork = 0;
        }
        break;
      case KEY_UP:
        this._selectedNetwork--;
        if (this._selectedNetwork < 0) {
          this._selectedNetwork = this._networks.length - 1;
        }
        break;
      default:
        await this._menu.handle(key);
    }
  }
}
