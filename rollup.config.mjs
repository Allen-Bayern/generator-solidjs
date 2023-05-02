import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";

export default {
    input: {
        "app/index": "./src/app/index.ts",
    },
    output: {
        dir: "./generators",
        format: "cjs",
    },
    plugins: [
        typescript(),
        terser({
            maxWorkers: 2,
        }),
        // Doc: https://github.com/vladshcherbin/rollup-plugin-copy#readme
        copy({
            targets: [{ src: "./src/app/templates/**/*", dest: "./generators/app/templates" }],
        }),
        json(),
    ],
};
