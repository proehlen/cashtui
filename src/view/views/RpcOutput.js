// @flow

import List from './List';

export default class RpcOutput extends List {
  constructor(rpcResult: Array<string>) {
    super(rpcResult, 'RPC Result');
  }
}
