// @flow
import clear from 'clear-console';
import colors from 'colors';
import { version } from '../package.json';
import Menu from './Menu';
import Main from './Main';

class Stack {
  _renderTitle() {
    console.log(
      colors.blue(
        `My Cash CLI (v${version})`
      )
    );
  }
  _stack: Menu[]
  constructor(initialMenu: Menu)  {
    this._stack = [];
    this.push(initialMenu);
  }

  get active(): Menu {
    return this._stack[this._stack.length - 1];
  }

  _render() {
    clear();
    this._renderTitle();
    this.active.render();
  }

  push(menu: Menu) {
    this._stack.push(menu);
    this._render();
  }

  pop() {
    this._stack.pop();
    this._render();
  }
}


const initialMenu = new Main();
const stack  = new Stack(initialMenu);
export default stack;
