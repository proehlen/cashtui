// @flow
/* eslint-disable no-console */

import http from 'http';
import fs from 'fs';

import options from '../options';

// Build connection options
const RPC_HOST = options.rpcbind;
const RPC_PORT = options.rpcport;
let RPC_AUTH = '';
if (options.rpccookiefile) {
  try {
    RPC_AUTH = fs.readFileSync(options.rpccookiefile, { encoding: 'utf8' });
  } catch (err) {
    console.error(`Error reading file '${options.rpccookiefile}'`);
    process.exit(0);
  }
} else if (options.rpcuser && options.rpcpasword) {
  RPC_AUTH = `${options.rpcuser}:${options.rpcpasword}`;
}

export default class Rpc {
  _history: Array<string>

  constructor() {
    this._history = [];
  }

  get history() {
    return this._history;
  }

  _addHistory(command: string) {
    // Remove earlier occurance of identical command
    const earlierIndex = this._history.findIndex(item => item === command);
    if (earlierIndex >= 0) {
      this._history.splice(earlierIndex, 1);
    }

    // Add command to top of history
    this._history.push(command);
  }

  request(command: string, remember: boolean = false): Promise<string> {
    if (remember) {
      this._addHistory(command);
    }

    const commandComponents = command.split(' ');
    const [method:string, ...params] = commandComponents;

    // return new pending promise
    let responseData = '';
    return new Promise((resolve, reject) => {
      type RpcRequest = {
        jsonrpc: string,
        id: string,
        method: string,
        params?: Array<any>
      }

      const rpcRequest: RpcRequest = {
        jsonrpc: '1.0',
        id: `node-manager${(new Date()).toISOString()}`,
        method,
      };
      if (params.length) {
        rpcRequest.params = params;
      }
      const postData = JSON.stringify(rpcRequest);

      const reqOptions = {
        hostname: RPC_HOST,
        port: RPC_PORT,
        auth: RPC_AUTH,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-rpc',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = http.request(reqOptions, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          responseData = responseData.concat(chunk);
        });
        res.on('end', () => {
          if (responseData) {
            try {
              // Probably JSON response
              const jsonResponse = JSON.parse(responseData);
              if (jsonResponse.error) {
                reject(new Error(`bitcoind error: ${JSON.stringify(jsonResponse.error)}`));
              } else {
                resolve(jsonResponse.result);
              }
            } catch (err) {
              // Not a JSON response - probably just an error message in plaintext
              reject(new Error(`bitcoind returned: ${responseData}`));
            }
          } else if (res.statusCode !== 200) {
            reject(new Error(`Bitcoin node responded with HTTP code ${res.statusCode}: ${res.statusMessage}`));
          } else {
            resolve('');
          }
        });
      });

      req.on('error', (e) => {
        reject(new Error(`problem with request: ${e.message}`));
      });

      // write data to request body
      req.write(postData);
      req.end();
    });
  }
}
