module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',
    'prettier',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'node/exports-style': ['error', 'module.exports'],
    'node/file-extension-in-import': ['error', 'always'],
    'node/prefer-global/buffer': ['error', 'always'],
    'node/prefer-global/console': ['error', 'always'],
    'node/prefer-global/process': ['error', 'always'],
    'node/prefer-promises/fs': 'error',
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    'key-spacing': ['error', { afterColon: true }],
    'no-multi-spaces': 'error',
  },
};
