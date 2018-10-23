// @flow
import cliui from 'cliui';
import Transaction from 'cashlib/lib/Transaction';
import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
import Tab from 'tooey/lib/Tab';

import TransactionInputs from './TransactionInputs';
import TransactionOutputs from './TransactionOutputs';
import TransactionRaw from './TransactionRaw';
import state from '../../model/state';


export default class TransactionHeader extends ViewBase {
  _tab: Tab
  _menu: Menu

  constructor(tab: Tab) {
    super('Transaction');
    this._tab = tab;
    const items: MenuItem[] = [
      new MenuItem('I', 'Inputs', 'Transaction inputs', async () => tab.pushView(new TransactionInputs(tab))),
      new MenuItem('O', 'Outputs', 'Transaction outputs', async () => tab.pushView(new TransactionOutputs(tab))),
      new MenuItem('R', 'Raw', 'Show raw serialized transaction', async () => tab.pushView(new TransactionRaw())),
      new MenuItem('S', 'Send', 'Broadcast transaction to network', this.send.bind(this)),
    ];
    this._menu = new Menu(tab, items);
  }

  async send() {
    try {
      await state.rpc.request(`sendrawtransaction ${state.transactions.active.serialize()}`);
    } catch (err) {
      this._tab.setError(err.message);
    }
  }

  render() {
    // Render transaction info
    const firstColWidth = 10;
    const ui = cliui();
    const transaction: Transaction = state.transactions.active;
    ui.div({
      text: 'Id: ',
      width: firstColWidth,
    }, {
      text: transaction.getId(),
    });
    ui.div({
      text: 'Inputs: ',
      width: firstColWidth,
    }, {
      text: transaction.inputs.length,
    });
    ui.div({
      text: 'Outputs: ',
      width: firstColWidth,
    }, {
      text: transaction.outputs.length,
    });
    console.log(ui.toString());

    // Render menu last for correct cursor positioning
    this._menu.render(false);
  }

  async handle(key: string): Promise<boolean> {
    return this._menu.handle(key);
  }
}
