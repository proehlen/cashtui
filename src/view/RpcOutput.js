// @flow

import ListBase from './ListBase';

export default class RpcOutput extends ListBase {
  constructor(rpcResult: Array<string>) {
    super(rpcResult, 'RPC Result');
  }
}
