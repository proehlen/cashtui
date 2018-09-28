/* Generic view for displaying text with standard menu */
// @flow

import ViewBase from 'tooey/lib/ViewBase';
import Text from 'tooey/lib/Text';
import Menu from 'tooey/lib/Menu';
import app from '../app';

export default class GenericText extends ViewBase {
  _text: Text
  _menu: Menu

  constructor(title: string, data: string) {
    super(title);

    this._menu = new Menu(app);
    this._text = new Text(app, data);
  }

  render() {
    // Render text first
    this._text.render();

    // Render menu last so cursor position is left in correct position
    this._menu.render(false);
  }

  async handle(key: string) {
    await this._menu.handle(key);
    await this._text.handle(key);
  }
}
