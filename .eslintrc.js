
module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    browser: true,
    amd: true,
    webextensions: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'google',
    'plugin:vue/recommended'
  ],
  // add your custom rules here
  rules: {
    "max-len": ["warn", { "code": 120 }],
    "linebreak-style": ["off"],
    "no-unused-vars": ["warn", { "args": "none", varsIgnorePattern: "self" }],
    "no-console": ["off"],
    "valid-jsdoc": ["off"],
    "vue/max-attributes-per-line": ["off"],
    "object-curly-spacing": ["error", "always"],
    "indent": ["error", 4],
    "vue/html-indent": ["error", 4],
    "vue/singleline-html-element-content-newline": ["off"],
    "vue/html-closing-bracket-newline": ["off"],
    "vue/component-name-in-template-casing": ["error", "kebab-case"]
  }
};
