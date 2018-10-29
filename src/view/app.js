// @flow
import ViewBase from 'tooey/view/ViewBase';
import App from 'tooey/App';
import Tab from 'tooey/Tab';

import Connection from '../model/Connection';
import NetworkSelection from './views/NetworkSelection';
import ConnectionHistory from './views/ConnectionHistory';
import { version } from '../../package.json';

const makeInitialView = (tab: Tab) => {
  let result: ViewBase;
  // Render starting view
  if (Connection.getHistory().length) {
    result = new ConnectionHistory(tab);
  } else {
    result = new NetworkSelection(tab);
  }
  return result;
};

const app = new App(`Cashtui v${version}`, makeInitialView);
export default app;
