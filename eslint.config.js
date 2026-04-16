//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  {
    rules: {
      // Loose rules inherited from prototype phase
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',

      // ---------- Production hardening ----------
      // Disallow console.log in source code; warn/error only
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Enforce type-only imports for better tree-shaking
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Prevent duplicate imports from the same module
      'no-duplicate-imports': 'warn',

      // Discourage (but don't block) explicit any
      '@typescript-eslint/no-explicit-any': 'warn',

      // Encourage proper error handling on Promises
      '@typescript-eslint/no-floating-promises': 'off', // too noisy for now

      // Disabled: too many false positives with TS strict mode + optional
      // chaining — these rules flag legitimate defensive checks. Common to
      // disable in production codebases.
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-misused-promises': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // `no-unsafe-*` are disabled in favour of catching the root cause via
      // `no-explicit-any`. These rules light up every read from an `any`
      // value (e.g. response payloads) and obscure the real source.
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      '@typescript-eslint/no-base-to-string': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/only-throw-error': 'warn',
      // Allow inline `type` specifiers (required to avoid conflict with
      // `no-duplicate-imports` when a module exports both values and types)
      'import/consistent-type-specifier-style': 'off',
    },
  },
  {
    // Ignore generated + test files
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      'vite.config.ts',
      'vitest.config.ts',
      'knip.json',
      'src/routeTree.gen.ts',
      '.output/**',
      '.nitro/**',
    ],
  },
];
