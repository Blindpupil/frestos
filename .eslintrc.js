// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: [
    'vue',
    'html'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    'comma-dangle': ['error', 'never'],
    'semi': ['error', 'never'],
    'func-names': ["error", "as-needed"],
    'semi': ['error', 'never'],
    'no-console': ["error", { allow: ["warn", "error", "info"] }],
    'no-unused-expressions': ["error", { "allowShortCircuit": true, "allowTernary": true }],
    'no-underscore-dangle': ["error", { "allow": ["_doc", "_id"] }],
    'prefer-arrow-callback': ['error', { 'allowNamedFunctions': true }],
    'arrow-body-style': ["error", "as-needed", { "requireReturnForObjectLiteral": true }],
    'no-restricted-properties': [2, {"object": "disallowedObjectName", "property": "disallowedPropertyName"}],
    "prefer-destructuring": ["error", {
      "array": true,
      "object": true
    }],
    'no-multi-spaces': ["error",
      {
        exceptions: {
          'VariableDeclarator': true,
          'ImportDeclaration': true,
          'AssignmentExpression': true
        }
      }
    ],
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
