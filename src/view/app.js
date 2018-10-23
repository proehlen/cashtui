// @flow
import ViewBase from 'tooey/lib/ViewBase';
import App from 'tooey/lib/App';
import Tab from 'tooey/lib/Tab';

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
