// @flow
import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import List from './List';
import stack from './stack';

export default class RpcOutput extends MenuBase {
  _list: List

  constructor(rpcResult: Array<string>) {
    const options: MenuOption[] = [];
    // options.push(new MenuOption('T', 'Transactions', 'Work with transactions'));
    // options.push(new MenuOption('R', 'RPC', 'Execute JSON RPC commands'));
    super('RPC Result', options, true);

    this._list = new List(rpcResult);
  }


  render() {
    super.render();
    this._list.render();
  }

  handle(key: string) {
    switch (key.toUpperCase()) {
      // case 'R':
      //   stack.push(new RpcCommandInput());
      //   break;
      // case 'T':
      //   stack.push(new TransactionsMenu());
      //   break;
      default:
        super.handle(key);
    }
  }
}