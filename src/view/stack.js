// @flow
import clear from 'clear-console';
import colors from 'colors';
import cliui from 'cliui';
import readline from 'readline';

import { version } from '../../package.json';
import AbstractComponent from './AbstractComponent';

type WindowDimensions = {
  width: number,
  height: number
};

type StatusType = 'error' | 'warning' | 'info';

type Status = {
  type: StatusType,
  message: string,
}

class Stack {
  _stack: Array<AbstractComponent>
  _status: Status
  constructor()  {
    this._stack = [];
    this._status = {
      type: 'info',
      message: 'Welcome'
    };
  }

  get active(): AbstractComponent {
    return this._stack[this._stack.length - 1];
  }

  get depth() {
    return this._stack.length - 1;
  }

  get status() {
    return this._status;
  }

  set status(status: Status) {
    this._status = status;
  }

  render() {
    clear();
    this._renderTitle();
    this._renderStatus();
    readline.cursorTo(process.stdout, 0, 1);
    this.active.render();
  }

  getWindowSize(): WindowDimensions {
    const [width, height] = process.stdout.getWindowSize();
    return {
      width,
      height
    };
  }

  _renderStatus() {
    const {width, height} = this.getWindowSize();
    let bgColor;
    switch (this._status.type) {
      case 'error':
        bgColor = 'bgRed';
        break;
      case 'warning':
        bgColor = 'bgYellow';
        break;
      case 'info':
        bgColor = 'bgBlue';
        break;
    }
    readline.cursorTo(process.stdout, 0, height - 2);
    const ui = cliui();
    ui.div({
      text: colors[bgColor].black(this.status.message),
    });
    console.log(ui.toString());
  }

  _renderTitle() {
    readline.cursorTo(process.stdout, 0, 0);
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
