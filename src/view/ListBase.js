// @flow

import cliui from 'cliui';

import MenuBase from './MenuBase';
import MenuOption from './MenuOption';
import stack from './stack';
import output from './output';

export default class ListBase extends MenuBase {
  _data: Array<string>

  _startIndex: number

  constructor(data: Array<string>, title: string) {
    const options: MenuOption[] = [];
    options.push(new MenuOption('N', 'Next page', 'Go to next page'));
    options.push(new MenuOption('P', 'Previous page', 'Return to previous page'));
    super(title, options, true);
    this._data = data;
    this._startIndex = 0;
  }

  render() {
    const ui = cliui({ wrap: false });
    let endIndex = this._startIndex + output.contentHeight;
    if (endIndex > this._data.length) {
      endIndex = this._data.length;
    }

    output.cursorTo(0, output.contentStartRow);
    for (let i = this._startIndex; i < endIndex; i++) {
      ui.div({
        text: this._data[i].substr(0, output.width - 2),
      });
    }
    console.log(ui.toString());
    super.render();
  }

  async handle(key: string): Promise<void> {
    switch (key.toUpperCase()) {
      case 'P': {
        const maybeStart = this._startIndex - output.contentHeight;
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
        if (maybeStart > (this._data.length - 1)) {
          stack.setInfo('No more pages');
        } else {
          this._startIndex = maybeStart;
        }
        break;
      }
      default:
        await super.handle(key);
    }
  }
}
