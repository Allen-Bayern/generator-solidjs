const { useBasicConfig } = require("./webpack/BasicConf");

const config = useBasicConfig(process.env.NODE_ENV ?? "development");

/**
 * If you want to add or modify the webpack config,
 * you can use webpack-chain like the function below.
 * The documentation: https://github.com/neutrinojs/webpack-chain
 */
// function chainWebpack() {
//     config.
// }

module.exports = config.toConfig();
