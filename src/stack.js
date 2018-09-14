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
  constructor()  {
    this._stack = [];
  }

  get active(): Menu {
    return this._stack[this._stack.length - 1];
  }

  get depth() {
    return this._stack.length - 1;
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
  
  quit() {
    clear();
    console.log('Bye!');
    process.exit(0);
  }

}


const stack  = new Stack();
export default stack;
