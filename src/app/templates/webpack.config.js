const { useBasicConfig } = require("./webpack/BasicConf");

const config = useBasicConfig(process.env.NODE_ENV ?? "development");

/**
 * If you want to add or modify the webpack config,
 * you can use webpack-chain and open the comment.
 * The documentation of webpack chain: https://github.com/neutrinojs/webpack-chain
 */

// config.

module.exports = config.toConfig();
