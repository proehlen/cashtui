// @flow
import cliui from 'cliui';

import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import state from '../model/state';

export default class TransactionMenu extends MenuBase {
  constructor() {
    const options: MenuOption[] = [];
    options.push(new MenuOption('I', 'Inputs', 'Transaction inputs'));
    options.push(new MenuOption('O', 'Outputs', 'Transaction outputs'));
    options.push(new MenuOption('L', 'Label', 'Label this transaction'));
    super('Transaction', options);
  }

  render() {
    const firstColWidth = 15;
    const ui = cliui();
    ui.div({
      text: 'Inputs: ',
      width: firstColWidth,
    }, {
      text: state.transactions.active.inputs.length,
    });
    ui.div({
      text: 'Outputs: ',
      width: firstColWidth,
    }, {
      text: state.transactions.active.outputs.length,
    });
    console.log(ui.toString());
    super.render();
  }
}
