// @flow

import MenuForm from 'tooey/lib/MenuForm';
import ViewBase from 'tooey/lib/ViewBase';
import MenuOption from 'tooey/lib/MenuOption';
import Transaction from 'cashlib/lib/Transaction';

import app from '../app';
import state from '../../model/state';
import SelectOutput from './SelectOutput';

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

    this._menuForm = new MenuForm(app, fields, menuOptions);
  }

  async lookupOutput() {
    try {
      const txId = this._menuForm.fields[fieldIdx.TRANSACTION_ID].input.value;
      if (!txId) {
        app.setError('Enter Transaction Id to lookup output in.');
      } else {
        const raw = await state.rpc.request(`getrawtransaction ${txId}`);
        const transaction = Transaction.deserialize(raw.toString());
        const select = new SelectOutput(transaction.outputs, this.onLookupSelection.bind(this));
        app.pushView(select);
      }
    } catch (err) {
      app.setError(err.message);
    }
  }

  async onLookupSelection(outputIndex: number) {
    this._menuForm.fields[fieldIdx.OUTPUT_INDEX].input.value = outputIndex.toString();
    app.popView();
    this._menuForm.menu.setFirstOptionSelected();
  }

  async addInput() {
    try {
      app.setWarning('Sorry, adding inputs is still under construction');
      // app.popView();
    } catch (err) {
      app.setError(err.message);
    }
  }

  async handle(key: string) {
    await this._menuForm.handle(key);
  }

  render() {
    this._menuForm.render();
  }
}
