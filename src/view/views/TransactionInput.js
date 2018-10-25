// @flow
import FormView from 'tooey/lib/FormView';
import { type FormFieldDescription } from 'tooey/lib/Form';
import ViewBase from 'tooey/lib/ViewBase';
import Input from 'cashlib/lib/Input';
import { fromBytes } from 'stringfu';

import GenericText from './GenericText';
import app from '../app';

const fieldIdx = {
  TRANSACTION_ID: 0,
  INPUT_INDEX: 1,
  OUTPUT_TRANSACTION: 2,
  OUTPUT_INDEX: 3,
  SCRIPT: 4,
};

export default class ConnectionSettings extends ViewBase {
  _formView: FormView
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

    this._formView = new FormView(app.activeTab, fields, [{
      key: 'S',
      label: 'Script',
      help: 'Show entire signature script',
      execute: this.toScript.bind(this),
    }], {
      readOnly: true,
    });
  }

  async toScript() {
    const scriptText = fromBytes(this._input.signatureScript);
    // TODO nav to script parser
    const scriptView = new GenericText('Signature Script', scriptText);
    app.pushView(scriptView);
  }

  async handle(key: string): Promise<boolean> {
    return this._formView.handle(key);
  }

  render() {
    this._formView.render();
  }
}
