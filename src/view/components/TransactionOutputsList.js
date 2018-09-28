// @flow
import Output from 'cashlib/lib/Output';
// import Address from 'cashlib/lib/Address';

import ComponentBase from 'tooey/lib/ComponentBase';
import List, { type ListColumn, type ListData } from 'tooey/lib/List';
import Menu from 'tooey/lib/Menu';
import state from '../../model/state';
import app from '../app';

export default class TransactionOutputsList extends ComponentBase {
  _outputs: ListData
  _list: List

  constructor(outputs: Array<Output>, menu: Menu) {
    super();

    this._outputs = outputs.map(TransactionOutputsList._mapOutputToListRow);
    const columns: Array<ListColumn> = [{
      heading: 'Index',
      width: 8,
    }, {
      heading: 'Value (BCH)',
      width: 15,
    }, {
      heading: 'Address',
      width: 40,
    }, {
      heading: 'Type',
      width: 10,
    }];
    this._list = new List(app, columns, this._outputs, true, menu);
  }

  static _mapOutputToListRow(output: Output, index: number): Array<string> {
    const value = (output.value / 100000000).toFixed(8);
    let addressEncoded;
    try {
      const address = output.getAddress(state.connection.network);
      if (address) {
        addressEncoded = address.toString();
      }
    } catch (err) {
      app.setWarning(err.message);
    }
    if (!addressEncoded) {
      addressEncoded = 'Sorry, not available yet';
    }
    return [index.toString(), value, addressEncoded, output.scriptType];
  }

  render() {
    // Render outputs list
    this._list.render();
  }

  async handle(key: string) {
    await this._list.handle(key);
  }
}
