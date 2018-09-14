// @flow
import colors from 'colors';
import cliui from 'cliui';

import stack from '../stack';

export default class Menu {
  _title: string

  constructor(title: string) {
    this._title = title;
  }

  get title() {
    return this._title;
  }

  render() {
    throw new Error('Componet.render() is abstract.  Override in subclass.')
  }

  handle(key: string) {
    throw new Error('Componet.handle() is abstract.  Override in subclass.')
  }
}