module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,html,xml,ico,png,svg,json}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};