// @flow
import FormView from 'tooey/view/FormView';
import { type FormFieldDescription } from 'tooey/component/Form';
import ViewBase from 'tooey/view/ViewBase';
import Tab from 'tooey/Tab';
import Output from 'cashlib/lib/Output';

import GenericText from './GenericText';
import state from '../../model/state';

const fieldIdx = {
  TRANSACTION_ID: 0,
  OUTPUT_INDEX: 1,
  VALUE: 2,
  ADDRESS: 3,
  TYPE: 4,
  SCRIPT: 5,
};

export default class ConnectionSettings extends ViewBase {
  _tab: Tab
  _formView: FormView
  _output: Output

  constructor(tab: Tab, output: Output, transactionId?: string, outputIndex?: number) {
    super('Transaction Output');
    this._tab = tab;
    this._output = output;

    function blankIfUndefined(value: any) {
      return value === undefined ? '' : value.toString();
    }

    // Form fields
    const fields: Array<FormFieldDescription> = [];
    fields[fieldIdx.TRANSACTION_ID] = { label: 'Transaction Id', default: blankIfUndefined(transactionId), type: 'string' };
    fields[fieldIdx.OUTPUT_INDEX] = { label: 'Output number', default: blankIfUndefined(outputIndex), type: 'integer' };
    fields[fieldIdx.VALUE] = { label: 'Value', default: output.value.toString(), type: 'integer' };
    const connection = state.getConnection(this._tab);
    const address = output.getAddress(connection.network);
    fields[fieldIdx.ADDRESS] = { label: 'Address', default: blankIfUndefined(address), type: 'string' };
    fields[fieldIdx.TYPE] = { label: 'Type', default: blankIfUndefined(output.scriptType), type: 'string' };
    fields[fieldIdx.SCRIPT] = { label: 'Public key script', default: output.pubKeyScript.toHex(), type: 'string' };

    this._formView = new FormView(tab, fields, [{
      key: 'S',
      label: 'Script',
      help: 'Show entire public key script',
      execute: this.toScript.bind(this),
    }], {
      readOnly: true,
    });
  }

  async toScript() {
    const scriptText = this._output._pubKeyScript.toHex();
    // TODO nav to script parser
    const scriptView = new GenericText('Public Key Script', scriptText);
    this._tab.pushView(scriptView);
  }

  async handle(key: string): Promise<boolean> {
    return this._formView.handle(key);
  }

  render() {
    this._formView.render();
  }
}
