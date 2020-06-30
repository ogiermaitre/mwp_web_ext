module.exports = {
    settings: {
        'import/resolver': {
            webpack: {
                config: './webpack.config.resolve.js',
            },
        },
    },
    env: {
        node: true,
        es6: true,
        browser: true,
        webextensions: true,
    },
    plugins: [],
    extends: [
        'airbnb-base',
        'eslint:recommended',
    ],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 9,
        sourceType: 'module',
    },
    rules: {
        'consistent-this': 'off',
        'no-tabs': 'off',
        indent: [
            'error',
            4,
            { SwitchCase: 1 },
        ],
        'arrow-parens': ['error', 'as-needed'],
        'no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: true,
            },
        ],
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'ignore',
            },
        ],
        'no-underscore-dangle': 'off',
        'max-len': [
            'off',
            120,
        ],
        'no-irregular-whitespace': ['off', { skipStrings: true }],
        'no-extra-parens': 'error',
        eqeqeq: ['error', 'always'],
        'no-var': 'error',
        quotes: [
            'error',
            'single',
        ],
        semi: ['error', 'never'],
        'no-console': 0,
        strict: [1, 'global'],
        'no-return-assign': 'off',
        'no-floating-decimal': 0,
        'no-plusplus': 'off',
        'object-curly-newline': 'off',
        'no-shadow': 'off',
        'no-nested-ternary': 'off',
        'class-methods-use-this': 'off',
        'no-param-reassign': ['error', { props: false }],
        'new-cap': 'off',
        'func-names': 'off',
        'max-classes-per-file': 'off',
    },
}
