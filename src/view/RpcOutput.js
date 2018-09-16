// @flow
import cliui from 'cliui';

import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import stack from './stack';
import output from './output';

const GAP_UNDER_MENU_ROWS = 1;

export default class RpcOutput extends MenuBase {
  _data: Array<string>
  _startIndex: number

  constructor(rpcResult: Array<string>) {
    const options: MenuOption[] = [];
    options.push(new MenuOption('N', 'Next page', 'Go to next page'));
    options.push(new MenuOption('P', 'Previous page', 'Return to previous page'));
    super('RPC Result', options, true);

    this._data = rpcResult;
    this._startIndex = 0;
  }

  render() {
    const ui = cliui({ wrap: false });
    let endIndex = this._startIndex + this.contentAreaHeight;
    if (endIndex > this._data.length) {
      endIndex = this._data.length
    }

    output.cursorTo(0, output.contentStartRow + GAP_UNDER_MENU_ROWS);
    for (let i = this._startIndex; i < endIndex; i++) {
      ui.div({
        text: this._data[i].substr(0, output.width - 2),
      });
    }
    console.log(ui.toString());
    super.render();
  }

  get contentAreaHeight() {
    return output.contentHeight - GAP_UNDER_MENU_ROWS;
  }

  async handle(key: string): Promise<void> {
    switch (key.toUpperCase()) {
      case 'P': {
        const maybeStart = this._startIndex - this.contentAreaHeight;
        if (this._startIndex === 0) {
          stack.setInfo('Already at start');
        } else if (maybeStart < 0) {
          this._startIndex = 0;
        } else {
          this._startIndex = maybeStart;
        }
        break;
      }
      case 'N': {
        const maybeStart = this._startIndex + output.contentHeight;
        if (maybeStart > (this._data.length -1)) {
          stack.setInfo('No more pages');
        } else {
          this._startIndex = maybeStart;
        }
        break;
      }
      default:
        return super.handle(key);
    }
  }
}