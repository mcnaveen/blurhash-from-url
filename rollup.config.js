import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    { file: pkg.main, format: "cjs", plugins: [terser()] },
    { file: pkg.module, format: "es", plugins: [terser()] },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    "fs",
  ],

  plugins: [typescript({ typescript: require("typescript") })],
};
