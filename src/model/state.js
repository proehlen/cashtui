// @flow

import Rpc from './Rpc';
import Transactions from './Transactions';
import Connection from './Connection';

class State {
  _rpc: Rpc
  _transactions: Transactions
  _connection: Connection

  constructor() {
    this._rpc = new Rpc();
    this._transactions = new Transactions();
  }

  get rpc() { return this._rpc; }
  get transactions() { return this._transactions; }
  get connection() { return this._connection; }

  set connection(connection: Connection) {
    this._connection = connection;
  }
}

const state = new State();

export default state;
