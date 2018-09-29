// @flow
/* eslint-disable no-console */

import http from 'http';
import { isInteger } from 'stringfu';

import state from './state';

declare type RequestOptions = {
  hostname: string,
  port: number,
  method: string,
  auth?: string,
  headers: any,
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

  request(command: string, remember: boolean = false): Promise<string | any | number> {
    if (remember) {
      this._addHistory(command);
    }

    const commandComponents = command.split(' ');
    const [method:string, ...params: Array<any>] = commandComponents;

    // Coerce integer parameters into numeric types
    const modifiedParams = params.map((value) => {
      let result: any;
      if (isInteger(value)) {
        result = parseInt(value, 10);
      } else {
        result = value;
      }
      return result;
    });

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
        rpcRequest.params = modifiedParams;
      }
      const postData = JSON.stringify(rpcRequest);

      const reqOptions: RequestOptions = {
        hostname: state.connection.host,
        port: state.connection.port,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-rpc',
          'Content-Length': Buffer.byteLength(postData),
        },
      };
      if (state.connection.auth) {
        reqOptions.auth = state.connection.auth;
      }

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
                if (jsonResponse.error.message) {
                  reject(new Error(jsonResponse.error.message));
                } else {
                  reject(new Error(`bitcoind error: ${JSON.stringify(jsonResponse.error)}`));
                }
              } else {
                resolve(jsonResponse.result);
              }
            } catch (err) {
              // Not a JSON response - probably just an error message in plaintext
              reject(new Error(`Error: ${responseData}`));
            }
          } else if (res.statusCode !== 200) {
            reject(new Error(`Error: ${res.statusCode}: ${res.statusMessage}`));
          } else {
            resolve('');
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      // write data to request body
      req.write(postData);
      req.end();
    });
  }
}
