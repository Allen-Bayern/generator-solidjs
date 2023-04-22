const Config = require("webpack-chain");

const config = new Config();
module.exports = () => config.toConfig();
