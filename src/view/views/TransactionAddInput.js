// @flow

import MenuForm from '../components/MenuForm';
import ViewBase from './ViewBase';
import MenuOption from '../components/MenuOption';
import stack from '../stack';

const fieldIdx = {
  TRANSACTION_ID: 0,
  OUTPUT_INDEX: 1,
};

export default class TransactionAddInput extends ViewBase {
  _menuForm: MenuForm

  constructor() {
    super('Add Input');

    // Form fields
    const fields = [];
    fields[fieldIdx.TRANSACTION_ID] = { label: 'Transaction Id', default: '', password: false };
    fields[fieldIdx.OUTPUT_INDEX] = { label: 'Output index', default: '', password: false };

    // Menu options
    const menuOptions = [
      new MenuOption('O', 'OK', 'Add input with entered details', this.addInput.bind(this)),
    ];

    this._menuForm = new MenuForm(fields, menuOptions);
  }

  async addInput() {
    try {
      stack.setWarning('Sorry, adding inputs is still under construction');
      // stack.pop();
    } catch (err) {
      stack.setError(err.message);
    }
  }

  async handle(key: string) {
    await this._menuForm.handle(key);
  }

  render() {
    this._menuForm.render();
  }
}
