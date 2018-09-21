// @flow

import cliui from 'cliui';
import colors from 'colors';
import Network from 'my-bitcoin-cash-lib/lib/Network';

import Connection from '../model/Connection';
import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import ConnectionSettings from './ConnectionSettings';
import output from './output';
import state from '../model/state';
import stack from './stack';
import { KEY_UP, KEY_DOWN } from './keys';

export default class NetworkSelection extends MenuBase {
  _networks: Array<string>
  _selectedNetwork: number

  constructor() {
    const menuOptions = [
      new MenuOption('C', 'Continue', 'Connect to Network'),
      new MenuOption('R', 'Recent', 'Recent connections'),
    ];
    super('Connect to node', menuOptions, false);
    this._networks = [
      'mainnet',
      'testnet',
      'regtest',
      'nol',
    ];
    this._selectedNetwork = 0;
  }

  render() {
    const ui = cliui();

    output.cursorTo(0, output.contentStartRow);
    for (let i = 0; i < this._networks.length; ++i) {
      const option = this._networks[i];
      const selected = i === this._selectedNetwork;
      const selector = ` ${selected ? '>' : ' '} `;
      const optionText = selected && this.selectedOption.key === 'C'
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

    super.render();
  }

  async handle(key: string) {
    switch (key.toUpperCase()) {
      case 'C':
        try {
          const networkLabel = this._networks[this._selectedNetwork];
          const network = Network.fromString(networkLabel);
          const connection = new Connection(network);
          state.connection = connection;
          stack.push(new ConnectionSettings());
        } catch (err) {
          stack.setError(err.message);
        }
        break;
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
        await super.handle(key);
    }
  }
}
