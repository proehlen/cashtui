// @flow

import { Transaction } from 'cashlib';
import ViewBase from 'tooey/view/ViewBase';
import Menu, { type MenuItem } from 'tooey/component/Menu';
import Tab from 'tooey/Tab';
import InputView from 'tooey/view/InputView';
import state from '../../model/state';
import TransactionHeader from './TransactionHeader';

export default class TransactionsMenu extends ViewBase {
  _tab: Tab
  _menu: Menu

  constructor(tab: Tab) {
    super('Transactions');
    this._tab = tab;

    const items: MenuItem[] = [{
      key: 'I',
      label: 'By Id',
      help: 'Retrieve transaction from full node',
      execute: this.toTransactionIdInput.bind(this),
    }, {
      key: 'C',
      label: 'Create',
      help: 'Create new transaction',
      execute: this.createTransaction.bind(this),
    }, {
      key: 'D',
      label: 'Decode raw',
      help: 'Decode raw transaction',
      execute: this.toRawTransactionInput.bind(this),
    }, {
      key: 'R',
      label: 'Recent',
      help: 'Recent transactions',
    }];
    this._menu = new Menu(tab, items);
  }

  async toTransactionIdInput() {
    const inputView = new InputView(
      this._tab,
      'Transaction Id',
      async (inputValue) => {
        try {
          const raw = await state.rpc.request(`getrawtransaction ${inputValue}`);
          if (typeof raw === 'string') {
            const transaction = Transaction.deserialize(raw);
            state.transactions.active = transaction;
            this._tab.replaceView(new TransactionHeader(this._tab));
          } else {
            throw new Error('Unexpected value returned from RPC call');
          }
        } catch (err) {
          this._tab.setError(err.message);
        }
      },
    );
    this._tab.pushView(inputView);
  }

  async createTransaction() {
    state.transactions.active = new Transaction();
    this._tab.pushView(new TransactionHeader(this._tab));
  }

  async toRawTransactionInput() {
    const inputView = new InputView(this._tab, 'Enter raw transaction', async (inputValue) => {
      try {
        state.transactions.active = Transaction.deserialize(inputValue);
        this._tab.replaceView(new TransactionHeader(this._tab));
      } catch (error) {
        this._tab.setError(error.message);
      }
    });
    this._tab.pushView(inputView);
  }

  async handle(key: string): Promise<boolean> {
    return this._menu.handle(key);
  }

  render() {
    this._menu.render(false);
  }
}
