import svelte from "rollup-plugin-svelte";
import alias from '@rollup/plugin-alias';
import copy from 'rollup-plugin-copy'
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import image from "@rollup/plugin-image";
//import css from "rollup-plugin-css-only";
const fs = require('fs');

const production = !process.env.ROLLUP_WATCH;
const dest = production ? "dist" : "public";

export default [
  {
    input: "src/main.ts",
    output: {
      sourcemap: true,
      format: "iife",
      file: `${dest}/app.js`,
      name: "diapr",
    },
    plugins: [
      copy({
        targets: [
          { src: "src/index.html", dest: dest },
          { src: "assets/favicon.png", dest: dest },
        ]
      }),

      //css({ output: `${dest}/extra.css` }),

      image(),

      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css: (css) => {
          css.write(`${dest}/bundle.css`);
        },
        preprocess: sveltePreprocess({ postcss: true }),
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),

      alias({
        entries: [
          { find: '~', replacement: `${__dirname}/src` }
        ]
      }),

      commonjs(),
      typescript({ sourceMap: !production }),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      !production && serve(),

      // Watch the `${dest}` directory and refresh the
      // browser on changes when not in production
      !production && livereload({
        watch: dest,
        https: {
          key: fs.readFileSync('certs/diaprs.allisn.net.key'),
          cert: fs.readFileSync('certs/diaprs.allisn.net.crt')
        }
      }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },

  {
    input: "src/sw.js",
    output: {
      sourcemap: true,
      format: "iife",
      file: `${dest}/service-worker.js`,
    },
    plugins: [
      resolve(),
      commonjs(),
      production && terser()
    ],
    preserveEntrySignatures: false,
  }
];

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        });
      }
    },
  };
}
