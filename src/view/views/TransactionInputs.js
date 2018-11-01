// @flow

import Script from 'cashlib/lib/Script';
import Transaction from 'cashlib/lib/Transaction';
import Input from 'cashlib/lib/Input';
import ViewBase from 'tooey/view/ViewBase';
import List, { type ListColumn } from 'tooey/component/List';
import Menu, { type MenuItem } from 'tooey/component/Menu';
import Tab from 'tooey/Tab';
import SelectView, { type SelectViewItem } from 'tooey/view/SelectView';

import TransactionInput from './TransactionInput';
import TransactionAddInputManual from './TransactionAddInputManual';
import UnspentOutputs from './UnspentOutputs';
import state from '../../model/state';

export default class TransactionInputs extends ViewBase {
  _tab: Tab
  _menu: Menu
  _list: List<Input>

  constructor(tab: Tab) {
    super('Transaction Inputs');

    this._tab = tab;

    // Build menu
    const menuItems: MenuItem[] = [{
      key: 'S',
      label: 'Show',
      help: 'Show details for selected input',
      execute: this.toDetails.bind(this),
      visible: () => state.transactions.active.inputs.length > 0,
    }, {
      key: 'R',
      label: 'Remove',
      help: 'Remove selected input',
      execute: this.removeSelectedInput.bind(this),
      visible: () => state.transactions.active.inputs.length > 0,
    }, {
      key: 'A',
      label: 'Add',
      help: 'Add new input',
      execute: this.onAddInput.bind(this),
    }];
    this._menu = new Menu(tab, menuItems);

    const transaction: Transaction = state.transactions.active;
    const columns: Array<ListColumn<Input>> = [{
      heading: 'Transaction Id',
      width: 64,
      value: input => input.isCoinbase ? 'Coinbase' : input.transactionId.toHex(),
    }, {
      heading: 'Output',
      width: 8,
      value: input => input.isCoinbase ? ' ' : input.outputIndex.toString(),
    }, {
      heading: 'Sig?',
      width: 4,
      value: input => input.signatureScript.toBytes().length ? 'Yes' : '',
    }];

    this._list = new List(tab, columns, transaction.inputs, {
      rowSelection: true,
      menu: this._menu,
    });
  }

  async onAddInput() {
    const items: SelectViewItem[] = [{
      label: 'Select unspent output from node wallet',
      execute: this.toSelectUnspentOutputs.bind(this),
    }, {
      label: 'Enter utxo manually',
      execute: async () => this._tab.replaceView(new TransactionAddInputManual(this._tab)),
    }];
    const selectView = new SelectView(this._tab, 'Add input from...', items);
    this._tab.pushView(selectView);
  }

  async toSelectUnspentOutputs() {
    const connection = state.getConnection(this._tab);
    const rpcResult = await state.rpc.request(connection, 'listunspent');
    if (!Array.isArray(rpcResult) || !rpcResult.length) {
      this._tab.setError('No unspent outputs returned by node wallet.');
    } else {
      const view = new UnspentOutputs(
        this._tab,
        'Select UTXO',
        rpcResult,
        async (utxo) => {
          try {
            const input = new Input(utxo.txid, utxo.vout, new Script([]));
            state.transactions.active.addInput(input);
            this._tab.popView();
          } catch (err) {
            this._tab.setError(err.message);
          }
        },
      );
      this._tab.replaceView(view);
    }
  }

  async toDetails() {
    const input = state.transactions.active.inputs[this._list.selectedRowIndex];
    if (input) {
      this._tab.pushView(new TransactionInput(
        this._tab,
        input,
        state.transactions.active.getId(),
        this._list.selectedRowIndex,
      ));
    } else {
      this._tab.setWarning('No input selected');
    }
  }

  async removeSelectedInput() {
    state.transactions.active.removeInput(this._list.selectedRowIndex);
  }


  render() {
    // Render outputs list
    this._list.render();

    // Render menu last for correct cursor positioning
    this._menu.render(false);
  }

  async handle(key: string): Promise<boolean> {
    let handled = await this._menu.handle(key);
    if (!handled) {
      handled = await this._list.handle(key);
    }
    return handled;
  }
}
