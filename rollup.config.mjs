import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";

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
        copy(),
    ],
};
