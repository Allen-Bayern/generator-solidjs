const path = require("path");
const Config = require("webpack-chain");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const nodeExternals = require("webpack-node-externals");

const config = new Config()
    .mode("development")
    .entry("index")
    .add(path.resolve(__dirname, "src/app/index.ts"))
    .end()
    .output.path(path.resolve(__dirname, "generators"))
    .filename("app/index.js")
    .libraryTarget("umd")
    .end()
    .resolve.extensions.add(".js")
    .add(".jsx")
    .add(".ts")
    .add(".tsx")
    .add(".cjs")
    .add(".json")
    .add(".mjs")
    .end()
    .end()
    .resolve.extensions.add(".jsx")
    .end()
    .end()
    .target("node")
    .node.set("__dirname", false)
    .set("__filename", false)
    .end()
    .module.rule("js")
    .test(/\.[jt]sx?$/i)
    .exclude.add(/node_modules/)
    .add(/lib/)
    .add(/dist/)
    .add(/templates/)
    .add(/temp-templates/)
    .end()
    .include.add(path.resolve(__dirname, "src"))
    .end()
    .use("babel")
    .loader("babel-loader")
    .options({
        babelrc: false,
        configFile: path.resolve(__dirname, "babel.config.cjs"),
    })
    .end()
    .end()
    .end()
    .plugin("clean")
    .use(CleanWebpackPlugin)
    .end()
    .plugin("copy")
    .use(CopyWebpackPlugin, [
        {
            patterns: [
                {
                    from: "src/app/templates",
                    to: "app/templates",
                    info: { minimized: true },
                },
            ],
        },
    ])
    .end()
    .plugin("ForkTsCheckerWebpackPlugin")
    .use(ForkTsCheckerWebpackPlugin)
    .end()
    .plugin("terser")
    .use(TerserPlugin)
    .end()
    .externals([nodeExternals()])
    .toConfig();

module.exports = config;
