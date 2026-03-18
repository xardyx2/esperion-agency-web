// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
  features: {
    stylistic: true,
    tooling: true,
  },
  dirs: {
    src: ['./app', './tests', './e2e'],
  },
})
.append({
  name: 'esperion/relaxed-rules',
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@stylistic/max-statements-per-line': 'off',
    'require-yield': 'off',
    'unicorn/no-array-reduce': 'off',
    '@stylistic/no-mixed-operators': 'off',
    'no-cond-assign': 'off',
    'no-empty': 'warn',
    'no-control-regex': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-template-shadow': 'off',
    'vue/no-v-html': 'warn',
    'vue/valid-define-props': 'off',
    'vue/no-parsing-error': 'off',
    '@stylistic/comma-dangle': ['warn', 'never'],
    '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
  },
})
.append({
  ignores: [
    '.nuxt/**',
    '.output/**',
    '.opsx-output/**',
    'node_modules/**',
    'dist/**',
    '.git/**',
    'coverage/**',
    'bun.lockb',
    'package-lock.json',
    'yarn.lock',
    '**/*.d.ts',
  ],
})
