import eslintConfig from '@eslint-sets/eslint-config'

export default eslintConfig({
	ignores: ['examples/**'],
	markdown: false,
	rules: {
		camelcase: 'off',
		'n/no-unsupported-features/es-syntax': 'off',
		'n/no-unsupported-features/node-builtins': 'off',
		'perfectionist/sort-interfaces': 'off',
		'perfectionist/sort-named-exports': 'off',
		'perfectionist/sort-objects': 'off',
		'perfectionist/sort-imports': 'off',
		'perfectionist/sort-exports': 'off',
	},
	stylistic: {
		indent: 'tab',
	},
	type: 'lib',
	typescript: true,
	vue: true,
})
