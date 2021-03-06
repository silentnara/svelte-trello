import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import strip from '@rollup/plugin-strip'
import svelte from 'rollup-plugin-svelte';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import replace from 'rollup-plugin-replace';
import sveltePreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		// 서버 종료.
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			// 서버가 있으면 실행하지 않음.
			if (server) return;

			// 서버 생성.
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			// 프로세스 종료 이벤트에 서버 종료.
			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	// 진입점.
	input: 'src/main.js',
	// 번들 출력.
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			},
			preprocess: sveltePreprocess({
				scss: {
					prependData: '@import "./src/scss/main.scss";',
				},
				postcss: {
					plugins: [
						require('autoprefixer')()
					]
				}
			})
    }),
    
    replace({
      values: {
        'crypto.randomBytes': 'require("randombytes")'
      }
    }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		globals(),
		builtins(),
		alias({
			entries: [
				{ find: '~', replacement: path.resolve(__dirname, 'src/') }
			]
    }),
    
		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
    production && terser(),
    
    production && strip({
      include: '**/*.(svelte|js)',
    })
	],
	watch: {
		clearScreen: false
	}
};