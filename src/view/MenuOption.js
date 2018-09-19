// @flow

export default class MenuOption {
  _label: string
  _key: string
  _keyPosition: number
  _help: string

  constructor(key: string, label: string, help: string) {
    this._key = key;
    this._label = label;
    this._help = help;
    this._keyPosition = this._label.indexOf(this._key);
    if (this._keyPosition < 0) {
      throw new Error('Key not found in menu option label text.');
    }
  }

  get key() {
    return this._key;
  }

  get keyPosition() {
    return this._keyPosition;
  }

  get label() {
    return this._label;
  }

  get help() {
    return this._help;
  }
}
