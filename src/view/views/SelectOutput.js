// @flow

import ViewBase from 'tooey/lib/ViewBase';
import Menu, { type MenuItem } from 'tooey/lib/Menu';
import Output from 'cashlib/lib/Output';
import Tab from 'tooey/lib/Tab';

import OutputsList from '../components/OutputsList';

export type OnSelectedCallback = (number) => Promise<void>

export default class SelectOutput extends ViewBase {
  _menu: Menu
  _outputsList: OutputsList
  _outputs: Array<Output>
  _onSelected: OnSelectedCallback
  _tab: Tab

  constructor(tab: Tab, outputs: Array<Output>, onSelected: OnSelectedCallback) {
    super('Select Output');

    this._tab = tab;

    this._outputs = outputs;
    const ok: MenuItem = {
      key: 'O',
      label: 'OK',
      help: 'Continue with selected output',
      execute: this.onOk.bind(this),
    };
    this._menu = new Menu(tab, [ok], true);
    this._outputsList = new OutputsList(tab, outputs, this._menu, true);
    this._onSelected = onSelected;
  }

  async onOk() {
    await this._onSelected(this._outputsList.selectedOutputIndex);
  }

  render() {
    this._outputsList.render();
    this._menu.render(false);
  }

  async handle(input: string): Promise<boolean> {
    let handled = await this._outputsList.handle(input);
    if (!handled) {
      handled = await this._menu.handle(input);
    }
    return handled;
  }
}
