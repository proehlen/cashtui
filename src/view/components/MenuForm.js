// @flow

import ComponentBase from './ComponentBase';
import Form, { type FieldData } from './Form';
import Menu from './Menu';
import MenuOption from './MenuOption';

import {
  KEY_UP, KEY_DOWN,
} from '../keys';

export default class MenuForm extends ComponentBase {
  _menu: Menu
  _form: Form
  _activeComponent: ComponentBase

  constructor(fields: Array<FieldData>, menuOptions: Array<MenuOption>) {
    super();

    // Create form
    this._form = new Form(
      fields,
      this.onNoMoreFields.bind(this),
      this.onEscapeFromField.bind(this),
    );

    // Create menu
    this._menu = new Menu(menuOptions, true, this.onNoMoreOptions.bind(this));

    // Start with menu active
    this._activeComponent = this._menu;
  }

  get menu() { return this._menu; }
  get form() { return this._form; }

  async onNoMoreOptions(direction: number) {
    this._activeComponent = this._form;
    if (direction > 0) {
      this._form.setFirstFieldSelected();
    } else {
      this._form.setLastFieldSelected();
    }
  }

  async onNoMoreFields(direction: number) {
    this._activeComponent = this._menu;
    if (direction > 0) {
      this._menu.setFirstOptionSelected();
    } else {
      this._menu.setLastOptionSelected();
    }
  }

  async onEscapeFromField() {
    this._activeComponent = this._menu;
  }

  async handle(key: string) {
    if ((key === KEY_DOWN || key === KEY_UP) && this._activeComponent === this._menu) {
      // Menu doesn't respond to arrow up/down - in this view
      // we will use it to shift to form if menu is active
      this._activeComponent = this._form;
      this._form.setFirstFieldSelected();
    } else {
      await this._activeComponent.handle(key);
    }
  }

  render() {
    // Render components in proper order for cursor positioning
    if (this._activeComponent === this._menu) {
      this._form.render();
      this._menu.render(false);
    } else {
      this._menu.render(true);
      this._form.render();
    }
  }
}
