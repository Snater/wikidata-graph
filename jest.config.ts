import type {Config} from 'jest';

const config: Config = {
	collectCoverageFrom: [
		'<rootDir>/src/**/*.{js,ts,tsx}',
		'!<rootDir>/src/**/index.{js,ts,tsx}',
		'!<rootDir>/src/utils/*.{js,ts,tsx}'
	],
	preset: 'ts-jest/presets/js-with-ts',
	resolver: '<rootDir>/jest/customResolver.js',
	testEnvironment: 'jsdom',
	transformIgnorePatterns: [
		'/node_modules/(?!(wikibase-sdk|query-string|decode-uri-component|filter-obj|split-on-first)/)'
	]
};

export default config;
