// @flow
/* eslint-disable no-console */

import args from 'args';
import colors from 'colors';

declare type Options = {
  rpcbind: string,
  rpcport: number,
  rpccookiefile?: string,
  rpcuser?: string,
  rpcpasword?: string,
}

args
  .option(['a', 'rpcbind'], 'bitcoind rpc address', 'localhost')
  .option(['p', 'rpcport'], 'bitcoind rpc port', 18332)
  .option(['c', 'rpccookiefile'], 'Location of bitcoind auth cookie')
  .option(['u', 'rpcuser'], 'Username for connecting to bitcoind')
  .option(['w', 'rpcpasword'], 'Password for connecting to bitcoind')
  .examples([{
    usage: 'npm start --rpcbind localhost --rpcport 18332 --rpccookiefile ~.bitcoin/regtest/.cookie',
    description: 'Connect to local regtest node using cookie file.',
  }]);


const options: Options = args.parse(process.argv, {
  name: 'npm start',
});
if (!options.rpccookiefile && !options.rpcuser) {
  console.log('\n');
  console.log(colors.bgRed.white(
    'Please provide RPC credentials (cookie file or user/password. See "npm start help")',
  ));
  console.log('\n');
  args.showHelp();
}


export default options;
