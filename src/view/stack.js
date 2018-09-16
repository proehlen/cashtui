// @flow
import colors from 'colors';
import cliui from 'cliui';
import readline from 'readline';

import output from './output';
import { version } from '../../package.json';
import ComponentBase from './ComponentBase';
import MenuBase from './MenuBase';

declare var process: any;

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
  _stack: Array<ComponentBase>
  _status: Status
  constructor()  {
    this._stack = [];
    this._status = {
      type: 'info',
      message: 'Welcome'
    };
  }

  get active(): ComponentBase {
    return this._stack[this._stack.length - 1];
  }

  get depth() {
    return this._stack.length - 1;
  }

  get status() {
    return this._status;
  }

  setError(message: string) {
    this._status = {
      type: 'error',
      message,
    }
  }

  setInfo(message: string) {
    this._status = {
      type: 'info',
      message,
    }
  }

  setWarning(message: string) {
    this._status = {
      type: 'warning',
      message,
    }
  }

  render() {
    debugger;
    output.clear();
    this._renderTitle();
    this._renderStatus();
    readline.cursorTo(process.stdout, 0, 1);
    this.active.render();
  }

  _renderStatus() {
    let bgColor, fgColor;
    switch (this._status.type) {
      case 'error':
        bgColor = 'bgRed';
        fgColor = 'yellow';
        break;
      case 'warning':
        bgColor = 'bgYellow';
        fgColor = 'black';
        break;
      case 'info':
        bgColor = 'bgBlue';
        fgColor = 'white';
        break;
    }
    readline.cursorTo(process.stdout, 0, output.height - 2);
    const ui = cliui();
    ui.div({
      text: colors[bgColor][fgColor](this.status.message),
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

  push(component: ComponentBase) {
    this._stack.push(component);
    this._setStatusForActiveComponent();
  }

  pop() {
    this._stack.pop();
    this._setStatusForActiveComponent();
  }

  replace(component: ComponentBase) {
    this._stack.pop();
    this._stack.push(component);
    this._setStatusForActiveComponent();
  }

  _setStatusForActiveComponent()  {
    const activeComponent = this.active;
    if (activeComponent instanceof MenuBase) {
      const activeOption = activeComponent.activeOption;
      stack.setInfo(activeOption.help);
    } else {
      // Input
      stack.setInfo('Press Enter to finish; Esc to clear/cancel');
    }
  }

  quit() {
    output.clear();
    console.log('Bye!');
    process.exit(0);
  }

}

const stack  = new Stack();
export default stack;
