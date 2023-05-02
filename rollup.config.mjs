import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: {
        "app/index": "./src/app/index.ts",
    },
    output: {
        dir: "./generators",
        format: "cjs",
    },
    external: [
        "textextensions",
        "binaryextensions"
    ],
    plugins: [
        terser({
            maxWorkers: 2,
        }),
        // Doc: https://github.com/vladshcherbin/rollup-plugin-copy#readme
        copy({
            targets: [{ src: "./src/app/templates", dest: "./generators/app" }],
        }),
        json(),
        nodeResolve({
            preferBuiltins: true,
        }),
        commonjs(),
        typescript(),
    ],
};
