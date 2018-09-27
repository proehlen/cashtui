// @flow

import ViewBase from './ViewBase';
import Text from '../components/Text';
import Menu from '../components/Menu';

export default class OutputText extends ViewBase {
  _text: Text
  _menu: Menu

  constructor(title: string, data: string) {
    super(title);

    this._menu = new Menu();
    this._text = new Text(data);
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
