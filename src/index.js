import stack from './stack';
import Main from './components/Main';

stack.push(new Main());

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.on('data', (key) => {
  stack.active.handle(key);
})
