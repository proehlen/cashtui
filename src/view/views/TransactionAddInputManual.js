// @flow

import FormView from 'tooey/view/FormView';
import ViewBase from 'tooey/view/ViewBase';
import { type MenuItem } from 'tooey/component/Menu';
import Tab from 'tooey/Tab';
import Transaction from 'cashlib/lib/Transaction';
import Input from 'cashlib/lib/Input';
import Script from 'cashlib/lib/Script';

import state from '../../model/state';
import SelectOutput from './SelectOutput';

const fieldIdx = {
  TRANSACTION_ID: 0,
  OUTPUT_INDEX: 1,
  SIG: 2,
};

export default class TransactionAddInputManual extends ViewBase {
  _formView: FormView
  _tab: Tab

  constructor(tab: Tab) {
    super('Add Input');

    this._tab = tab;

    // Form fields
    const fields = [];
    fields[fieldIdx.TRANSACTION_ID] = {
      label: 'Transaction id',
      default: '',
      type: 'string',
      required: true,
    };
    fields[fieldIdx.OUTPUT_INDEX] = {
      label: 'Output index',
      default: '',
      type: 'integer',
      required: true,
    };
    fields[fieldIdx.SIG] = { label: 'Signature script', default: '', type: 'string' };

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
        const connection = state.getConnection(this._tab);
        const raw = await state.rpc.request(connection, `getrawtransaction ${txId}`);
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
      if (this._formView.form.validate()) {
        const txId = this._formView.fields[fieldIdx.TRANSACTION_ID].input.value;
        const outputIdx = this._formView.fields[fieldIdx.OUTPUT_INDEX].input.value;
        const sigScript = new Script(this._formView.fields[fieldIdx.SIG].input.value);
        const input = new Input(txId, parseInt(outputIdx, 10), sigScript);
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
