// @flow

import Output from 'cashlib/lib/Output';
import FormView from 'tooey/view/FormView';
import ViewBase from 'tooey/view/ViewBase';
import Tab from 'tooey/Tab';
import { type MenuItem } from 'tooey/component/Menu';

import state from '../../model/state';

const fieldIdx = {
  ADDRESS: 0,
  VALUE: 1,
};

export default class TransactionAddOutputP2PKH extends ViewBase {
  _tab: Tab
  _formView: FormView

  constructor(tab: Tab) {
    super('Add P2PKH Output');
    this._tab = tab;

    // Form fields
    const fields = [];
    fields[fieldIdx.ADDRESS] = {
      label: 'Address',
      default: '',
      type: 'string',
      required: true,
    };
    // TODO - enter values in BCH (requires 'float' type to be added tooey)
    fields[fieldIdx.VALUE] = {
      label: 'Value (Satoshis)',
      default: '',
      type: 'integer',
      required: true,
    };

    // Menu items
    const menuItems: MenuItem[] = [{
      key: 'O',
      label: 'OK',
      help: 'Add output with entered details',
      execute: this.addOutput.bind(this),
    }];

    this._formView = new FormView(tab, fields, menuItems);
  }

  async addOutput() {
    try {
      const address = this._formView.fields[fieldIdx.ADDRESS].input.value;
      const value = parseInt(this._formView.fields[fieldIdx.VALUE].input.value, 10);
      if (this._formView.form.validate()) {
        const output = Output.createP2PKH(address, value);
        state.transactions.active.addOutput(output);
        // Go back to Outputs
        this._tab.popView();
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
