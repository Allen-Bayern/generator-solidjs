import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

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
    ],
};
