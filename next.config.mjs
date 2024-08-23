/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	reactStrictMode: false,
	webpack: config => {
		// Required for using EJS client-side.
		config.resolve.fallback = {fs: false};
		return config;
	},
};

export default nextConfig;
