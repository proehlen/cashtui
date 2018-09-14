// @flow
import clear from 'clear-console';
import colors from 'colors';
import cliui from 'cliui';

import { version } from '../package.json';
import Component from './components/Component';

class Stack {
  _stack: Array<Component>
  constructor()  {
    this._stack = [];
  }

  get active(): Component {
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

  push(component: Component) {
    this._stack.push(component);
    this.render();
  }

  pop() {
    this._stack.pop();
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
