module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', "react-hooks"],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], // we don't care that .js files contain JSX code
    'react/jsx-props-no-spreading': 'off', // HOCs should have prop spreading
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-use-before-define": ["error", { "functions": true, "classes": true, "variables": false }], // disable the rule for variables, but enable it for functions and classes
  },
};
