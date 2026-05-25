import { defineConfig } from 'vite';

import { sveltekit } from '@sveltejs/kit/vite';
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
	plugins: [
		sveltekit(),
		// visualizer({
		// 	open: true,
		// 	gzipSize: true,
		// 	brotliSize: true,
		// }),
	]
});
