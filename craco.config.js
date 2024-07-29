module.exports = {
	webpack: {
		configure: webpackConfig => ({
			...webpackConfig,
			resolve: {
				...webpackConfig.resolve,
				fallback: {
					fs: false,
					path: false,
				},
			},
			// https://github.com/facebook/create-react-app/pull/11752
			ignoreWarnings: [
				function ignoreSourcemapsloaderWarnings(warning) {
					return (
						warning.module && warning.module.resource.includes('node_modules')
						&& warning.details && warning.details.includes('source-map-loader')
					)
				},
			],
		}),
	},
};
