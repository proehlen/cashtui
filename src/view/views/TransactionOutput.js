// @flow
import MenuForm from 'tooey/lib/MenuForm';
import { type FormFieldDescription } from 'tooey/lib/Form';
import ViewBase from 'tooey/lib/ViewBase';
import Output from 'cashlib/lib/Output';
import { fromBytes } from 'stringfu';

import state from '../../model/state';
import app from '../app';

const fieldIdx = {
  TRANSACTION_ID: 0,
  OUTPUT_INDEX: 1,
  VALUE: 2,
  ADDRESS: 3,
  TYPE: 4,
  SCRIPT: 5,
};

export default class ConnectionSettings extends ViewBase {
  _menuForm: MenuForm
  _output: Output

  constructor(output: Output, transactionId?: string, outputIndex?: number) {
    super('Transaction Output');
    this._output = output;

    function blankIfUndefined(value: any) {
      return value === undefined ? '' : value.toString();
    }

    // Form fields
    const fields: Array<FormFieldDescription> = [];
    fields[fieldIdx.TRANSACTION_ID] = { label: 'Transaction Id', default: blankIfUndefined(transactionId), type: 'string' };
    fields[fieldIdx.OUTPUT_INDEX] = { label: 'Output number', default: blankIfUndefined(outputIndex), type: 'integer' };
    fields[fieldIdx.VALUE] = { label: 'Value', default: output.value.toString(), type: 'integer' };
    const address = output.getAddress(state.connection.network);
    fields[fieldIdx.ADDRESS] = { label: 'Address', default: blankIfUndefined(address), type: 'string' };
    fields[fieldIdx.TYPE] = { label: 'Type', default: blankIfUndefined(output.scriptType), type: 'string' };
    fields[fieldIdx.SCRIPT] = { label: 'Public key script', default: fromBytes(output.pubKeyScript), type: 'string' };

    this._menuForm = new MenuForm(app, fields, [], {
      readOnly: true,
    });
  }

  async handle(key: string) {
    await this._menuForm.handle(key);
  }

  render() {
    this._menuForm.render();
  }
}
