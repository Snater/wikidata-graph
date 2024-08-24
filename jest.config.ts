import type {Config} from 'jest';

const config: Config = {
	collectCoverageFrom: [
		'<rootDir>/src/**/*.{js,ts,tsx}',
		'!<rootDir>/src/**/index.{js,ts,tsx}',
		'!<rootDir>/src/utils/*.{js,ts,tsx}'
	],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	resolver: '<rootDir>/jest/customResolver.js',
	setupFilesAfterEnv: ['<rootDir>/jest/setupTests.ts'],
	testEnvironment: 'jsdom',
	transform: {
		'\\.[jt]sx?$': ['babel-jest', {configFile: './jest/babel.config.json'}],
	},
	transformIgnorePatterns: [
		'/node_modules/(?!(wikibase-sdk|query-string|decode-uri-component|filter-obj|split-on-first)/)'
	],
};

export default config;
