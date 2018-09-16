// @flow
import cliui from 'cliui';
import readline from 'readline';

export default class List {
  _data: Array<string>
  constructor(data: Array<string>) {
    this._data = data;
  }

  render(startRow: number, maxRows: number) {
    readline.cursorTo(process.stdout, 0, startRow);
    const ui = cliui();
    for (let i = 0; i < this._data.length && i < maxRows; i++) {
      ui.div({
        text: this._data[i],
      });
    }
    console.log(ui.toString());
  }
}