// @flow

import http from 'http';
import fs from 'fs';
import path from 'path';

const RPC_HOST = '127.0.0.1';
const RPC_PORT = 18332;
const RPC_AUTH = '__cookie__:Vifr/4SB8EdFrKAoHuuOhebVnP7MajUdMRDRALvpywE=';

export default class Rpc { 
  _auth: string

  request(method: string, ...params: Array<any>): Promise<string> {
    let responseData = '';

    // return new pending promise
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

      const options = {
        hostname: RPC_HOST,
        port: RPC_PORT,
        auth: RPC_AUTH,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-rpc',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = http.request(options, (res) => {
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
