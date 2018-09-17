import stack from './view/stack';
import MainMenu from './view/MainMenu';

stack.push(new MainMenu());
stack.render();

const { stdin } = process;
stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.on('data', async (key) => {
  await stack.active.handle(key);
  stack.render();
});
