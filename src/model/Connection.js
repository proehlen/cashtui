// @flow

import fs from 'fs';
import path from 'path';
import Network from 'my-bitcoin-cash-lib/lib/Network';

import state from './state';

const MAX_HISTORY = 25;

export type History = {
  network: string,
  host: string,
  port: number,
  cookieFile: string,
  user: string,
  password: string,
}

export default class Connection {
  _network: Network
  _host: string
  _port: number
  _cookieFile: string
  _user: string
  _password: string
  _isConnected: boolean
  _auth: string

  constructor(network: Network) {
    this._isConnected = false;
    this._network = network;
    this._host = '127.0.0.1';
    this._auth = '';
    const datadir = Connection.getDefaultDataDir();
    switch (network.label) {
      case 'mainnet':
        this._port = 8332;
        this._cookieFile = path.join(datadir, '.cookie');
        break;
      case 'testnet':
        this._port = 18332;
        this._cookieFile = path.join(datadir, 'testnet3', '.cookie');
        break;
      case 'regtest':
        this._port = 18332;
        this._cookieFile = path.join(datadir, 'regtest', '.cookie');
        break;
      case 'nol':
        this._port = 9332;
        this._cookieFile = path.join(datadir, 'nol', '.cookie');
        break;
      default:
        throw new Error(`Unrecognized network ${network.label}`);
    }
  }

  // Readonly members
  get network() { return this._network; }
  get isConnected() { return this._isConnected; }

  // Settable members
  get host() { return this._host; }
  get port() { return this._port; }
  get cookieFile() { return this._cookieFile; }
  get user() { return this._user; }
  get password() { return this._password; }

  _clearConnection() {
    this._auth = '';
    this._isConnected = false;
  }

  set host(host: string) {
    this._clearConnection();
    this._host = host;
  }

  set port(port: number) {
    this._clearConnection();
    this._port = port;
  }

  set cookieFile(cookieFile: string) {
    this._clearConnection();
    this._cookieFile = cookieFile;
  }

  set password(password: string) {
    this._clearConnection();
    this._password = password;
  }

  set user(user: string) {
    this._clearConnection();
    this._user = user;
  }

  get auth(): string {
    if (!this._auth) {
      if (this._cookieFile) {
        try {
          this._auth = fs.readFileSync(this._cookieFile, { encoding: 'utf8' });
        } catch (err) {
          throw new Error(`Error reading file '${this._cookieFile}'`);
        }
      } else {
        this._auth = `${this._user}:${this._password}`;
      }
    }
    return this._auth;
  }

  async connect() {
    await state.rpc.request('getinfo');
    this._isConnected = true;
    Connection.addHistory(this);
  }

  static getDefaultDataDir() {
    let datadir;
    switch (process.platform) {
      case 'win32':
        // Windows >= Vista:
        if (process.env.user) {
          datadir = `C:\\Users\\${process.env.user}\\AppData\\Roaming\\Bitcoin`;
        } else {
          throw new Error('Unable to detect data directory for current user');
        }
        break;
      case 'linux':
        // Unix:
        datadir = '~/.bitcoin';
        break;
      case 'darwin':
        // Mac:
        datadir = '~/Library/Application Support/Bitcoin';
        break;
      default:
        throw new Error(`Unrecognized platform '${process.platform}'`);
    }
    return datadir;
  }

  static getHistory(): Array<History> {
    let history = [];
    const stored = state.localStorage.getItem('connectionHistory');
    if (stored) {
      history = JSON.parse(stored);
    }
    return history;
  }

  static addHistory(connection: Connection) {
    const newRec: History = {
      network: connection.network.label,
      host: connection.host,
      port: connection.port,
      cookieFile: connection.cookieFile,
      user: connection.user,
      password: connection.password,
    };

    const history = this.getHistory();
    if (history.length) {
      history.unshift(newRec);
    } else {
      history.push(newRec);
    }

    if (history.length > MAX_HISTORY) {
      history.splice(MAX_HISTORY);
    }

    state.localStorage.setItem('connectionHistory', JSON.stringify(history));
  }
}
