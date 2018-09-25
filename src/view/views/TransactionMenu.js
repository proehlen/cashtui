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


export default class TransactionMenu extends ViewBase {
  _menu: Menu

  constructor() {
    super('Transaction');
    const options: MenuOption[] = [
      new MenuOption('I', 'Inputs', 'Transaction inputs', async () => stack.push(new TransactionInputs())),
      new MenuOption('O', 'Outputs', 'Transaction outputs', async () => stack.push(new TransactionOutputs())),
      new MenuOption('R', 'Raw', 'Show raw serialized transaction', async () => stack.push(new TransactionRaw())),
    ];
    this._menu = new Menu(options);
  }

  render() {
    // Render transaction info
    const firstColWidth = 15;
    const ui = cliui();
    const transaction: Transaction = state.transactions.active;
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
    this._menu.render();
  }

  async handle(key: string): Promise<void> {
    await this._menu.handle(key);
  }
}
