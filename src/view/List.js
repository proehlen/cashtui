// @flow
// import colors from 'colors';
import cliui from 'cliui';
// import readline from 'readline';

// import stack from './stack';

// const KEY_ESCAPE = String.fromCharCode(0x1b);
// const KEY_ENTER = String.fromCharCode(0x0d);

export default class List {
  _data: Array<string>
  constructor(data: Array<string>) {
    this._data = data;
  }

  render() {
    // Build options text
    const ui = cliui();
    for (let i = 0; i < this._data.length; i++) {
      ui.div({
        text: this._data[i],
      // }, {
      //   text: this._text
      });

    }
    console.log(ui.toString());
  }
}