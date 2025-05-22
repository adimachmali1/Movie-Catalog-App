import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const prettierConfigObject = {
  plugins: {
    prettier: prettierPlugin,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: true,
        singleQuote: true,
      },
    ],
  },
  extends: [prettierConfig],
};

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': eslintPluginUnusedImports,
      prettier: prettierPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off',

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  prettierConfigObject
);
