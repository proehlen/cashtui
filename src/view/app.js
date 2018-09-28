// @flow
import App from './components/App';
import { version } from '../../package.json';

const app = new App('Cashtui', `v${version}`);
export default app;
