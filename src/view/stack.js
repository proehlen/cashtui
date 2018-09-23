// @flow

import colors from 'colors';
import cliui from 'cliui';

import output from './output';
import { version } from '../../package.json';
import state from '../model/state';
import ViewBase from './views/ViewBase';
import Input from './components/Input';

declare var process: any;

type StatusType = 'error' | 'warning' | 'info';

type Status = {
  type: StatusType,
  message: string,
}

class Stack {
  _stack: Array<ViewBase>

  _status: Status

  constructor() {
    this._stack = [];
    this._status = {
      type: 'info',
      message: 'Welcome',
    };
  }

  get active(): ViewBase {
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
    };
  }

  setInfo(message: string) {
    this._status = {
      type: 'info',
      message,
    };
  }

  setWarning(message: string) {
    this._status = {
      type: 'warning',
      message,
    };
  }

  render() {
    output.clear();
    this._renderTitle();
    this._renderStatus();
    output.cursorTo(0, output.contentStartRow);
    this.active.render();
  }

  _renderStatus() {
    let bgColor;
    let fgColor;
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
      default:
        bgColor = 'white';
        fgColor = 'black';
    }
    output.cursorTo(0, output.height - 2);
    const ui = cliui({ wrap: false });

    let networkName = '';
    const { connection } = state;
    if (connection && connection.isConnected) {
      networkName = connection.network.label;
    }

    const networkWidth = networkName.length;
    const messageWidth = output.width - networkWidth;
    const message = this.status.message.substr(0, messageWidth);
    ui.div({
      text: colors[bgColor][fgColor](message),
      width: messageWidth,
    }, {
      text: networkName,
      width: networkWidth,
    });
    console.log(ui.toString());
  }

  _renderTitle() {
    output.cursorTo(0, 0);
    const ui = cliui();
    const versionText = `v${version}`;
    ui.div({
      text: colors.blue(
        'My Cash CLI',
      ),
      align: 'left',
    }, {
      text: this.active.title,
      align: 'center',
    }, {
      text: versionText,
      align: 'right',
    });
    console.log(ui.toString());
  }

  push(component: ViewBase) {
    this._stack.push(component);
    this._setStatusForActiveComponent();
  }

  pop() {
    this._stack.pop();
    this._setStatusForActiveComponent();
  }

  replace(component: ViewBase) {
    this._stack.pop();
    this._stack.push(component);
    this._setStatusForActiveComponent();
  }

  _setStatusForActiveComponent() {
    const activeComponent = this.active;
    if (activeComponent instanceof Input) {
      // Input
    }
  }

  quit() {
    output.clear();
    console.log('Bye!');
    process.exit(0);
  }
}

const stack = new Stack();
export default stack;
