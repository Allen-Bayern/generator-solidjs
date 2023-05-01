const Config = require("webpack-chain");
const { resolve } = require("path");

/**
 * generate a basic config
 * @param {object} env used environment variables
 * @returns Webpack Chained Config
 */
function useBasicConfig() {
    return new Config().merge({
        entry: {
            index: [resolve(__dirname, "src/index.tsx")],
        },
        output: {
            filename: "[name].[contenthash].bundle.js",
            path: resolve(__dirname, "dist"),
        },
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
            },
            extensions: [".js", ".jsx", ".json", ".mjs", ".ts", ".tsx"],
        },
        module: {
            rule: {
                jsx: {
                    test: /\.[jt]sx$/i,
                    include: resolve(__dirname, "src"),
                    exclude: /node_modules/,
                    use: {
                        babel: {
                            loader: "babel-loader",
                            options: {
                                babelrc: false,
                                configFile: resolve(__dirname, "babel.config.cjs"),
                            },
                        },
                    },
                },
            },
        },
    });
}

module.exports = {
    useBasicConfig,
};
