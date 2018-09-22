// @flow

import cliui from 'cliui';

import ViewBase from './ViewBase';
import Menu from '../components/Menu';
import MenuOption from '../components/MenuOption';
import stack from '../stack';
import output from '../output';

export default class List extends ViewBase {
  _data: Array<string>
  _startIndex: number
  _menu: Menu

  constructor(data: Array<string>, title: string) {
    super(title);
    const options: MenuOption[] = [];
    if (data.length > output.contentHeight) {
      options.push(new MenuOption('N', 'Next page', 'Go to next page', this.nextPage.bind(this)));
      options.push(new MenuOption('P', 'Previous page', 'Return to previous page', this.previousPage.bind(this)));
    }
    this._menu = new Menu(options, true);
    this._data = data;
    this._startIndex = 0;
  }

  render() {
    // Render list
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

    // Render menu last for cursor positioning
    this._menu.render();
  }

  async previousPage() {
    const maybeStart = this._startIndex - output.contentHeight;
    if (this._startIndex === 0) {
      stack.setInfo('Already at start');
    } else if (maybeStart < 0) {
      this._startIndex = 0;
    } else {
      this._startIndex = maybeStart;
    }
  }

  async nextPage() {
    const maybeStart = this._startIndex + output.contentHeight;
    if (maybeStart > (this._data.length - 1)) {
      stack.setInfo('No more pages');
    } else {
      this._startIndex = maybeStart;
    }
  }

  async handle(key: string): Promise<void> {
    await this._menu.handle(key);
  }
}
