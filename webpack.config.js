const path = require("path");
const Config = require("webpack-chain");

const config = new Config();

// add entry
config
    .entry("app")
    .add(path.resolve(__dirname, "src/app/index.ts"))
    .end()
    .output.path(path.resolve(__dirname, "generators/"))
    .filename("[name]/index.js")
    .libraryTarget("umd")
    .end()
    .resolve.extensions.add(".ts")
    .add(".tsx")
    .add(".js")
    .end()
    .alias.set("@", path.resolve(__dirname, "src"))
    .end()
    .end()
    .target("node");

module.exports = () => config.toConfig();
