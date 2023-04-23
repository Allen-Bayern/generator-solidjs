const path = require("path");
const Config = require("webpack-chain");

const config = new Config();

// add entry
config.entry("app").add(path.resolve(__dirname, "src/app/index.ts"));

module.exports = () => config.toConfig();
