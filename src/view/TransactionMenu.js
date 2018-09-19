// @flow
import cliui from 'cliui';
import Transaction from 'my-bitcoin-cash-lib/lib/Transaction';

import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import TransactionInputs from './TransactionInputs';
import TransactionOutputs from './TransactionOutputs';
import TransactionRaw from './TransactionRaw';
import state from '../model/state';
import stack from './stack';


export default class TransactionMenu extends MenuBase {
  constructor() {
    const options: MenuOption[] = [];
    options.push(new MenuOption('I', 'Inputs', 'Transaction inputs'));
    options.push(new MenuOption('O', 'Outputs', 'Transaction outputs'));
    options.push(new MenuOption('R', 'Raw', 'Show raw serialized transaction'));
    super('Transaction', options);
  }

  render() {
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
    super.render();
  }

  async handle(key: string): Promise<void> {
    switch (key.toUpperCase()) {
      case 'R':
        stack.push(new TransactionRaw());
        break;
      case 'O':
        stack.push(new TransactionOutputs());
        break;
      case 'I':
        stack.push(new TransactionInputs());
        break;
      default:
        super.handle(key);
    }
  }
}
