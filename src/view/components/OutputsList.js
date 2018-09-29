// @flow
import Output from 'cashlib/lib/Output';
import { leftPad } from 'stringfu';

import ComponentBase from 'tooey/lib/ComponentBase';
import List, { type ListColumn, type OutputRow } from 'tooey/lib/List';
import Menu from 'tooey/lib/Menu';
import state from '../../model/state';
import app from '../app';

const VALUE_COLUMN_WIDTH = 15;

export default class OutputsList extends ComponentBase {
  _list: List

  constructor(outputs: Array<Output>, menu: Menu, selection?: boolean) {
    super();

    const columns: Array<ListColumn> = [{
      heading: 'Index',
      width: 8,
    }, {
      heading: 'Value (BCH)',
      width: VALUE_COLUMN_WIDTH,
    }, {
      heading: 'Address',
      width: 40,
    }, {
      heading: 'Type',
      width: 10,
    }];
    this._list = new List(app, columns, outputs, {
      dataMapper: OutputsList._mapOutputToListRow,
      menu,
      rowSelection: selection,
    });
  }

  static _mapOutputToListRow(output: Output, index: number): OutputRow {
    const value = (output.value / 100000000).toFixed(8);
    const formattedValue = leftPad(value, VALUE_COLUMN_WIDTH, ' ');
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
    return [index.toString(), formattedValue, addressEncoded, output.scriptType];
  }

  get selectedOutputIndex(): number {
    return this._list.selectedRowIndex;
  }

  render() {
    // Render outputs list
    this._list.render();
  }

  async handle(key: string) {
    await this._list.handle(key);
  }
}
