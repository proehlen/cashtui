// @flow

export default class MenuOption {
  _key: string
  _label: string
  _help: string

  constructor (key: string, label: string, help: string) {
    this._key = key;
    this._label = label;
    this._help = help;
  }

  get key() {
    return this._key;
  }
  
  get label() {
    return this._label;
  }

  get help() {
    return this._help;
  }
}
