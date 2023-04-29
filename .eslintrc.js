module.exports = {
	env: {
		browser: true,
	},
	extends: ['eslint:recommended'],
	overrides: [{
		extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
		files: ['**/*.ts', '**/*.tsx'],
		parser: '@typescript-eslint/parser',
		plugins: ['@typescript-eslint'],
	}],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 6,
		sourceType: 'module',
	},
	root: true,
};