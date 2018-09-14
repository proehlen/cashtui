// @flow
import clear from 'clear-console';
import colors from 'colors';
import cliui from 'cliui';

import { version } from '../../package.json';
import AbstractComponent from './AbstractComponent';

class Stack {
  _stack: Array<AbstractComponent>
  constructor()  {
    this._stack = [];
  }

  get active(): AbstractComponent {
    return this._stack[this._stack.length - 1];
  }

  get depth() {
    return this._stack.length - 1;
  }

  render() {
    clear();
    this._renderTitle();
    this.active.render();
  }

  _renderTitle() {
    const ui = cliui();
    ui.div({
      text: colors.blue(
        'My Cash CLI'
      ),
      align: 'left'
    }, {
      text: this.active.title ,
      align: 'center'
    }, {
      text: `v${version}`,
      align: 'right'
    });
    console.log(ui.toString());
  }

  push(component: AbstractComponent) {
    this._stack.push(component);
    this.render();
  }

  pop() {
    this._stack.pop();
    this.render();
  }

  replace(component: AbstractComponent) {
    this._stack.pop();
    this._stack.push(component);
    this.render();
  }


  quit() {
    clear();
    console.log('Bye!');
    process.exit(0);
  }

}

const stack  = new Stack();
export default stack;
