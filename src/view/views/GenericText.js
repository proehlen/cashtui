/* Generic view for displaying text with standard menu */
// @flow

import ViewBase from 'tooey/view/ViewBase';
import Text from 'tooey/component/Text';
import Menu from 'tooey/component/Menu';
import app from '../app';

export default class GenericText extends ViewBase {
  _text: Text
  _menu: Menu

  constructor(title: string, data: string) {
    super(title);

    this._menu = new Menu(app.activeTab);
    this._text = new Text(app.activeTab, data);
  }

  render() {
    // Render text first
    this._text.render();

    // Render menu last so cursor position is left in correct position
    this._menu.render(false);
  }

  async handle(key: string): Promise<boolean> {
    let handled = await this._menu.handle(key);
    if (!handled) {
      handled = await this._text.handle(key);
    }
    return handled;
  }
}
