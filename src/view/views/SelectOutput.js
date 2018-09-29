// @flow

import ViewBase from 'tooey/lib/ViewBase';
import Menu from 'tooey/lib/Menu';
import MenuOption from 'tooey/lib/MenuOption';
import Output from 'cashlib/lib/Output';

import app from '../app';
import OutputsList from '../components/OutputsList';

export type OnSelectedCallback = (number) => Promise<void>

export default class SelectOutput extends ViewBase {
  _menu: Menu
  _outputsList: OutputsList
  _outputs: Array<Output>
  _onSelected: OnSelectedCallback

  constructor(outputs: Array<Output>, onSelected: OnSelectedCallback) {
    super('Select Output');

    this._outputs = outputs;
    const ok = new MenuOption('O', 'OK', 'Continue with selected output', this.onOk.bind(this));
    this._menu = new Menu(app, [ok], true);
    this._outputsList = new OutputsList(outputs, this._menu, true);
    this._onSelected = onSelected;
  }

  async onOk() {
    await this._onSelected(this._outputsList.selectedOutputIndex);
  }

  render() {
    this._outputsList.render();
    this._menu.render(false);
  }

  async handle(input: string) {
    await this._outputsList.handle(input);
    await this._menu.handle(input);
  }
}
