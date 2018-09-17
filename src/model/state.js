import Rpc from './Rpc';
import Transactions from './Transactions';

const state = {
  rpc: new Rpc(),
  transactions: new Transactions(),
};

export default state;
