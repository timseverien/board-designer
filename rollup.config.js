const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const nodeResolve = require('rollup-plugin-node-resolve');

export default {
	input: 'src/scripts/main.js',
	output: {
		format: 'esm',
		file: 'docs/assets/scripts/main.js',
	},
	plugins: [
		commonjs(),
		nodeResolve(),
		json(),
	],
};
