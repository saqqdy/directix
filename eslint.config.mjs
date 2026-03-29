import eslintConfig from '@eslint-sets/eslint-config'

export default eslintConfig({
	type: 'lib',
	ignores: ['examples/**'],
	markdown: false,
	rules: {
		camelcase: 'off',
	},
	stylistic: {
		indent: 'tab',
	},
	typescript: true,
	vue: true,
})
