// @flow
import Output from 'cashlib/lib/Output';
import { leftPad } from 'stringfu';
import Tab from 'tooey/lib/Tab';

import ComponentBase from 'tooey/lib/ComponentBase';
import List, { type ListColumn } from 'tooey/lib/List';
import Menu from 'tooey/lib/Menu';
import state from '../../model/state';

const VALUE_COLUMN_WIDTH = 15;

export default class OutputsList extends ComponentBase {
  _list: List<Output>
  _tab: Tab

  constructor(tab: Tab, outputs: Array<Output>, menu: Menu, rowSelection?: boolean) {
    super();

    this._tab = tab;

    const columns: Array<ListColumn<Output>> = [{
      heading: 'Index',
      width: 8,
      value: (output, index) => index.toString(),
    }, {
      heading: 'Value (BCH)',
      width: VALUE_COLUMN_WIDTH,
      value: (output) => {
        const bch = (output.value / 100000000).toFixed(8);
        return leftPad(bch, VALUE_COLUMN_WIDTH, ' ');
      },
    }, {
      heading: 'Address',
      width: 40,
      value: (output) => {
        let addressEncoded = '';
        try {
          const address = output.getAddress(state.connection.network);
          if (address) {
            addressEncoded = address.toString();
          }
        } catch (err) {
          tab.setWarning(err.message);
          addressEncoded = 'Sorry, not available yet';
        }
        return addressEncoded;
      },
    }, {
      heading: 'Type',
      width: 10,
      value: output => output.scriptType,
    }];

    this._list = new List(tab, columns, outputs, {
      menu,
      rowSelection,
    });
  }

  get selectedOutputIndex(): number {
    return this._list.selectedRowIndex;
  }

  render() {
    // Render outputs list
    this._list.render();
  }

  async handle(key: string): Promise<boolean> {
    return this._list.handle(key);
  }
}
