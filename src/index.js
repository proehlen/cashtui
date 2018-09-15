import stack from './view/stack';
import MainMenu from './view/MainMenu';

stack.push(new MainMenu());
stack.render();

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.on('data', (key) => {
  stack.active.handle(key);
  stack.render();
})
