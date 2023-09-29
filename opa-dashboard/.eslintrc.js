module.exports = {
    env: {
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      'prettier'
    ],
    parserOptions: {
        'ecmaVersion': 12,
        'sourceType': 'module',
        'parser': '@typescript-eslint/parser'
    },
    'plugins': [
        'vue',
        '@typescript-eslint'
    ],
    rules: {
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
    }
  }