module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    useJSXTextNode: true,
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  env: { es6: true, browser: true, node: true },
  plugins: ['react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'arrow-parens': 0,
    camelcase: [0, { properties: 0 }],
    'consistent-return': 0,
    'default-case': 0,
    'import/prefer-default-export': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-cycle': 0,
    'no-unused-vars': 1,
    'no-console': 1,
    'no-shadow': 0,
    'no-case-declarations': 0,
    'no-plusplus': 0,
    'no-use-before-define': 0,
    'no-restricted-globals': 0,
    'no-nested-ternary': 0,
    'operator-linebreak': 0,
    'react/jsx-no-bind': 2,
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 1,
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-unescaped-entities': 0,
    'react/destructuring-assignment': 0,
    'react/no-array-index-key': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
    '@typescript-eslint/ban-types': 0,
  },
};
