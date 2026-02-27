import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    js.configs.recommended,
    eslintConfigPrettier,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                URL: 'readonly',
                Math: 'readonly',
                Date: 'readonly',
                String: 'readonly',
                Number: 'readonly',
                Object: 'readonly',
                JSON: 'readonly',
                Array: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                process: 'readonly',
                module: 'readonly',
                require: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-undef': 'error'
        }
    },
    {
        ignores: ['node_modules/', 'dist/', 'coverage/']
    }
];
