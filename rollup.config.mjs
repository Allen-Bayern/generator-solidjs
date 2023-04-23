import typescript from "rollup-plugin-typescript2";

export default {
    input: {
        "app/index": "./src/app/index.ts",
    },
    output: {
        dir: "./generators",
        format: "cjs",
    },
    plugins: [typescript()],
};
