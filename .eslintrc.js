module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb-base',
    'plugin:flowtype/recommended',
  ],
  plugins: [
    'import',
    'flowtype',
  ],
  env: {
    node: true,
  },
  rules: {
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    'class-methods-use-this': 'off',
  },
};