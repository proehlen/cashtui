// @flow

import FormView from 'tooey/lib/FormView';
import ViewBase from 'tooey/lib/ViewBase';
import { type MenuItem } from 'tooey/lib/Menu';
import Tab from 'tooey/lib/Tab';
import Transaction from 'cashlib/lib/Transaction';
import Input from 'cashlib/lib/Input';

import state from '../../model/state';
import SelectOutput from './SelectOutput';

const fieldIdx = {
  TRANSACTION_ID: 0,
  OUTPUT_INDEX: 1,
};

export default class TransactionAddInputManual extends ViewBase {
  _formView: FormView
  _tab: Tab

  constructor(tab: Tab) {
    super('Add Input');

    this._tab = tab;

    // Form fields
    const fields = [];
    fields[fieldIdx.TRANSACTION_ID] = { label: 'Transaction Id', default: '', type: 'string' };
    fields[fieldIdx.OUTPUT_INDEX] = { label: 'Output index', default: '', type: 'integer' };

    // Menu items
    const menuItems: MenuItem[] = [{
      key: 'O',
      label: 'OK',
      help: 'Add input with entered details',
      execute: this.addInput.bind(this),
    }, {
      key: 'L',
      label: 'Lookup Output',
      help: 'Lookup output in transaction',
      execute: this.lookupOutput.bind(this),
      visible: () => this._getFieldValue(fieldIdx.TRANSACTION_ID) !== '',
    }];

    this._formView = new FormView(tab, fields, menuItems);
  }

  async lookupOutput() {
    try {
      const txId = this._getFieldValue(fieldIdx.TRANSACTION_ID);
      if (!txId) {
        this._tab.setError('Enter Transaction Id to lookup output in.');
      } else {
        const raw = await state.rpc.request(`getrawtransaction ${txId}`);
        const transaction = Transaction.deserialize(raw.toString());
        const select = new SelectOutput(
          this._tab,
          transaction.outputs,
          this.onLookupSelection.bind(this),
        );
        this._tab.pushView(select);
      }
    } catch (err) {
      this._tab.setError(err.message);
    }
  }

  async onLookupSelection(outputIndex: number) {
    this._formView.fields[fieldIdx.OUTPUT_INDEX].input.value = outputIndex.toString();
    this._tab.popView();
    this._formView.menu.setFirstItemSelected();
  }

  _getFieldValue(index: number) {
    let result;
    if (this._formView) {
      result = this._formView.fields[index].input.value;
    }
    return result;
  }

  async addInput() {
    try {
      // app.popView();
      const txId = this._formView.fields[fieldIdx.TRANSACTION_ID].input.value;
      const outputIdx = this._formView.fields[fieldIdx.OUTPUT_INDEX].input.value;
      if (!txId || !outputIdx) {
        this._tab.setWarning('Enter Transaction Id and Output Index to continue.');
      } else {
        const input = new Input(txId, parseInt(outputIdx, 10), new Uint8Array([]));
        state.transactions.active.addInput(input);
        this._tab.popView();
      }
    } catch (err) {
      this._tab.setError(err.message);
    }
  }

  async handle(key: string): Promise<boolean> {
    return this._formView.handle(key);
  }

  render() {
    this._formView.render();
  }
}
