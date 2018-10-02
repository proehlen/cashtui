// @flow
import cliui from 'cliui';
import Transaction from 'cashlib/lib/Transaction';

import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuItem from 'tooey/lib/MenuItem';
import TransactionInputs from './TransactionInputs';
import TransactionOutputs from './TransactionOutputs';
import TransactionRaw from './TransactionRaw';
import state from '../../model/state';
import app from '../app';


export default class TransactionHeader extends ViewBase {
  _menu: Menu

  constructor() {
    super('Transaction');
    const items: MenuItem[] = [
      new MenuItem('I', 'Inputs', 'Transaction inputs', async () => app.pushView(new TransactionInputs())),
      new MenuItem('O', 'Outputs', 'Transaction outputs', async () => app.pushView(new TransactionOutputs())),
      new MenuItem('R', 'Raw', 'Show raw serialized transaction', async () => app.pushView(new TransactionRaw())),
      new MenuItem('S', 'Send', 'Broadcast transaction to network', this.send.bind(this)),
    ];
    this._menu = new Menu(app, items);
  }

  async send() {
    try {
      await state.rpc.request(`sendrawtransaction ${state.transactions.active.serialize()}`);
    } catch (err) {
      app.setError(err.message);
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

  async handle(key: string): Promise<void> {
    await this._menu.handle(key);
  }
}
