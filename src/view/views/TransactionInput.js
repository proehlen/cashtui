// @flow
import FormView from 'tooey/view/FormView';
import { type FormFieldDescription } from 'tooey/component/Form';
import ViewBase from 'tooey/view/ViewBase';
import Tab from 'tooey/Tab';
import Input from 'cashlib/lib/Input';

import GenericText from './GenericText';

const fieldIdx = {
  TRANSACTION_ID: 0,
  INPUT_INDEX: 1,
  OUTPUT_TRANSACTION: 2,
  OUTPUT_INDEX: 3,
  SCRIPT: 4,
};

export default class ConnectionSettings extends ViewBase {
  _tab: Tab
  _formView: FormView
  _input: Input

  constructor(tab: Tab, input: Input, transactionId?: string, inputIndex?: number) {
    super('Transaction Input');
    this._tab = tab;
    this._input = input;

    function blankIfUndefined(value: any) {
      return value === undefined ? '' : value.toString();
    }

    // Form fields
    const fields: Array<FormFieldDescription> = [];
    fields[fieldIdx.TRANSACTION_ID] = { label: 'Transaction Id', default: blankIfUndefined(transactionId), type: 'string' };
    fields[fieldIdx.INPUT_INDEX] = { label: 'Input number', default: blankIfUndefined(inputIndex), type: 'integer' };
    fields[fieldIdx.OUTPUT_TRANSACTION] = { label: 'Output tx', default: input.transactionId.toHex(), type: 'string' };
    fields[fieldIdx.OUTPUT_INDEX] = { label: 'Output number', default: input.outputIndex.toString(), type: 'integer' };
    fields[fieldIdx.SCRIPT] = { label: 'Signature script', default: input.signatureScript.toHex(), type: 'string' };

    this._formView = new FormView(tab, fields, [{
      key: 'S',
      label: 'Script',
      help: 'Show entire signature script',
      execute: this.toScript.bind(this),
    }], {
      readOnly: true,
    });
  }

  async toScript() {
    const scriptText = this._input.signatureScript.toHex();
    // TODO nav to script parser
    const scriptView = new GenericText('Signature Script', scriptText);
    this._tab.pushView(scriptView);
  }

  async handle(key: string): Promise<boolean> {
    return this._formView.handle(key);
  }

  render() {
    this._formView.render();
  }
}
