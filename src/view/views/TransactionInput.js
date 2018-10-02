// @flow
import MenuForm from 'tooey/lib/MenuForm';
import { type FormFieldDescription } from 'tooey/lib/Form';
import ViewBase from 'tooey/lib/ViewBase';
import Input from 'cashlib/lib/Input';
import { fromBytes } from 'stringfu';

import app from '../app';

const fieldIdx = {
  TRANSACTION_ID: 0,
  INPUT_INDEX: 1,
  OUTPUT_TRANSACTION: 2,
  OUTPUT_INDEX: 3,
  SCRIPT: 4,
};

export default class ConnectionSettings extends ViewBase {
  _menuForm: MenuForm
  _input: Input

  constructor(input: Input, transactionId?: string, inputIndex?: number) {
    super('Transaction Input');
    this._input = input;

    function blankIfUndefined(value: any) {
      return value === undefined ? '' : value.toString();
    }

    // Form fields
    const fields: Array<FormFieldDescription> = [];
    fields[fieldIdx.TRANSACTION_ID] = { label: 'Transaction Id', default: blankIfUndefined(transactionId), type: 'string' };
    fields[fieldIdx.INPUT_INDEX] = { label: 'Input number', default: blankIfUndefined(inputIndex), type: 'integer' };
    fields[fieldIdx.OUTPUT_TRANSACTION] = { label: 'Output tx', default: input.transactionId, type: 'string' };
    fields[fieldIdx.OUTPUT_INDEX] = { label: 'Output number', default: input.outputIndex.toString(), type: 'integer' };
    fields[fieldIdx.SCRIPT] = { label: 'Signature script', default: fromBytes(input.signatureScript), type: 'string' };

    this._menuForm = new MenuForm(app, fields, []);
  }

  async handle(key: string) {
    await this._menuForm.handle(key);
  }

  render() {
    this._menuForm.render();
  }
}
