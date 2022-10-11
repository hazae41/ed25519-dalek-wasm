import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import ts from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import typescript from "ttypescript";

export const config = [
  {
    input: "./node/index.ts",
    output: [{
      dir: "./dist/mjs",
      format: "esm",
      preserveModules: true,
      sourcemap: true,
      entryFileNames: "[name].mjs",
    }, {
      dir: "./dist/cjs",
      format: "cjs",
      preserveModules: true,
      sourcemap: true,
      entryFileNames: "[name].cjs",
    }],
    plugins: [resolve(), ts({ typescript }), commonjs()]
  },
  {
    input: "./node/index.ts",
    output: [{
      dir: "./dist/types",
      format: "esm",
      preserveModules: true,
      entryFileNames: "[name].d.ts",
    }],
    plugins: [dts(), resolve(), ts({ typescript })],
  }
]

export default config