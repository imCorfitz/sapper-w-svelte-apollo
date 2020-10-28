/* Rollup plugins */
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import autoPreprocess from 'svelte-preprocess';

/* Packages */
import autoprefixer from 'autoprefixer';
import config from 'sapper/config/rollup.js';
import 'dotenv/config';
import path from 'path';
import pkg from './package.json';
import { scss, postcss } from 'svelte-preprocess';

/* Assignments */
const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
	(warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	(warning.code === 'THIS_IS_UNDEFINED') ||
	onwarn(warning);

const customResolver = resolve({
   extensions: ['.js', '.mjs', '.html', '.svelte', '.scss', '.json']
});

const aliasconfig = {
   customResolver,
   entries: [{ find: '~', replacement: path.join(__dirname, './src') }]
};

const preprocess = [
   scss({ sourceMap: false }),
   postcss({ plugins: [ autoprefixer ] }),
    autoPreprocess()
];

const replaceconfig = {
   'process.browser': true,
   'process.env.NODE_ENV': JSON.stringify(mode),
   'pkg.version': pkg.version
};

/* Config */
export default {

   client: {
      input: config.client.input().replace(/\.js$/, '.ts'),
      output: config.client.output(),
      onwarn,
      plugins: [
          resolve({ browser: true, dedupe: ['svelte'] }),
         alias(aliasconfig),
         commonjs(),
         customResolver,
         replace(replaceconfig),
         svelte({
            dev,
            hydratable: true,
				preprocess: sveltePreprocess(),
            emitCss: true,
            preprocess
         }),
         url({
            sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
            publicPath: '/client/'
         }),
         legacy && babel({
            exclude: ['node_modules/@babel/**'],
            extensions: ['.js', '.mjs', '.html', '.svelte'],
            plugins: [
               '@babel/plugin-syntax-dynamic-import',
               ['@babel/plugin-transform-runtime', {
                  useESModules: true
               }]
            ],
            presets: [['@babel/preset-env']],
            babelHelpers: 'runtime',
         }),

          typescript({ sourceMap: dev }),
         !dev && terser({ module: true, numWorkers: 1 })
      ],
      preserveEntrySignatures: false
   },

   server: {
      input: { server: config.server.input().server.replace(/\.js$/, ".ts") },
      output: config.server.output(),
      onwarn,
       plugins: [
           resolve({ dedupe: ['svelte'] }),
         alias(aliasconfig),
         commonjs(),
         customResolver,
         replace({...replaceconfig, 'process.browser': false}),
         svelte({
            dev,
            generate: 'ssr',
            hydratable: true,
            preprocess
         }),
         url({
            sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
            publicPath: '/client/',
            emitFiles: false // already emitted by client build
         }),

          typescript({ sourceMap: dev }),
      ],
      external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),
      preserveEntrySignatures: 'strict'
   },

   serviceworker: {
      input: config.serviceworker.input().replace(/\.js$/, '.ts'),
      output: config.serviceworker.output(),
      onwarn,
      plugins: [
         alias(aliasconfig),
         commonjs(),
			typescript({ sourceMap: dev }),
         customResolver,
         replace(replaceconfig),
         resolve(),
         !dev && terser({ numWorkers: 1 })
      ],
      preserveEntrySignatures: false
   }
};