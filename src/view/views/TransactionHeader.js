// @flow
import cliui from 'cliui';
import Transaction from 'cashlib/lib/Transaction';

import ViewBase from './ViewBase';
import Menu from '../components/Menu';
import MenuOption from '../components/MenuOption';
import TransactionInputs from './TransactionInputs';
import TransactionOutputs from './TransactionOutputs';
import TransactionRaw from './TransactionRaw';
import state from '../../model/state';
import stack from '../stack';


export default class TransactionHeader extends ViewBase {
  _menu: Menu

  constructor() {
    super('Transaction');
    const options: MenuOption[] = [
      new MenuOption('I', 'Inputs', 'Transaction inputs', async () => stack.push(new TransactionInputs())),
      new MenuOption('O', 'Outputs', 'Transaction outputs', async () => stack.push(new TransactionOutputs())),
      new MenuOption('R', 'Raw', 'Show raw serialized transaction', async () => stack.push(new TransactionRaw())),
      new MenuOption('S', 'Send', 'Broadcast transaction to network', this.send.bind(this)),
    ];
    this._menu = new Menu(options);
  }

  async send() {
    try {
      await state.rpc.request(`sendrawtransaction ${state.transactions.active.serialize()}`);
    } catch (err) {
      stack.setError(err.message);
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
