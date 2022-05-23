import nodePolyfills from 'rollup-plugin-polyfill-node'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
const production = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis',
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true,
				}),
			],
		},
	},
	define: {
		'process.env': process.env,
	},
	plugins: [
		react(),
		!production &&
			nodePolyfills({
				include: [
					'node_modules/**/*.{js,ts}',
					new RegExp('node_modules/.vite/.*{js,ts}'),
				],
			}),
	],
	build: {
		rollupOptions: {
			plugins: [
				// ↓ Needed for build
				nodePolyfills(),
			],
		},
		// ↓ Needed for build
		commonjsOptions: {
			transformMixedEsModules: true,
		},
	},
	resolve: {
		alias: {
			// ↓ see https://github.com/vitejs/vite/issues/6085
			'@ensdomains/address-encoder':
				'@ensdomains/address-encoder/lib/index.umd.js',
		},
	},
})
