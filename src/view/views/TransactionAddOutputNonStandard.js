// @flow

import Output from 'cashlib/lib/Output';
import FormView from 'tooey/view/FormView';
import ViewBase from 'tooey/view/ViewBase';
import Script from 'cashlib/lib/Script';
import Tab from 'tooey/Tab';
import { type MenuItem } from 'tooey/component/Menu';

import state from '../../model/state';

const fieldIdx = {
  VALUE: 0,
  SCRIPT: 1,
};

export default class TransactionAddOutputNonStandard extends ViewBase {
  _tab: Tab
  _formView: FormView

  constructor(tab: Tab) {
    super('Add Non-std Output');
    this._tab = tab;

    // Form fields
    const fields = [];
    // TODO - enter values in BCH (requires 'float' type to be added tooey)
    fields[fieldIdx.VALUE] = { label: 'Value (Satoshis)', default: '', type: 'integer' };
    fields[fieldIdx.SCRIPT] = { label: 'Script', default: '', type: 'string' };

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
      const script = this._formView.fields[fieldIdx.SCRIPT].input.value;
      const value = parseInt(this._formView.fields[fieldIdx.VALUE].input.value, 10);
      if (!script || !value) {
        this._tab.setWarning('Enter Value and Script to continue.');
      } else {
        const output = new Output(value, new Script(script));
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
