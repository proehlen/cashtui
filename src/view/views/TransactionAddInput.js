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
    fields[fieldIdx.TRANSACTION_ID] = { label: 'Transaction Id', default: '', type: 'string' };
    fields[fieldIdx.OUTPUT_INDEX] = { label: 'Output index', default: '', type: 'integer' };

    // Menu options
    const menuOptions = [
      new MenuOption('O', 'OK', 'Add input with entered details', this.addInput.bind(this)),
      new MenuOption('L', 'Lookup Output', 'Lookup output in transaction', this.lookupOutput.bind(this)),
    ];

    this._menuForm = new MenuForm(fields, menuOptions);
  }

  async lookupOutput() {
    try {
      const txId = this._menuForm.fields[fieldIdx.TRANSACTION_ID].input.value;
      if (!txId) {
        stack.setError('Enter Transaction Id to lookup output in.');
      } else {
        stack.setWarning('Sorry, the Lookup feature is still under construction');
      // stack.push();
      }
    } catch (err) {
      stack.setError(err.message);
    }
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
