// @flow

import path from 'path';

import Network from 'my-bitcoin-cash-lib/lib/Network';

export default class Connection {
  _network: Network
  _host: string
  _port: number
  _cookieFile: string
  _user: string
  _password: string
  _isConnected: boolean

  constructor(network: Network) {
    this._isConnected = false;
    this._network = network;
    this._host = '127.0.0.1';
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
  set host(host: string) { this._host = host; }
  get port() { return this._port; }
  set port(port: number) { this._port = port; }
  get cookieFile() { return this._cookieFile; }
  set cookieFile(cookieFile: string) { this._cookieFile = cookieFile; }
  get user() { return this._user; }
  set user(user: string) { this._user = user; }
  get password() { return this._password; }
  set password(password: string) { this._password = password; }


  get auth(): string {
    return 'test';
  }

  connect() {


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
}
