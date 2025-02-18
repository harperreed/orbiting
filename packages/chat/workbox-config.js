module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,html,xml,ico,png,svg,json,css,woff2,webp}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};