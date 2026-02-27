module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    extends: ['eslint:recommended', 'prettier'],
    rules: {
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-undef': 'error'
    },
    ignorePatterns: ['node_modules/', 'dist/', 'coverage/']
};

