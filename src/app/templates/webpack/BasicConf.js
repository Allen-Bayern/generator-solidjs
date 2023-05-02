const Config = require('webpack-chain');
const { resolve } = require('path');

// Plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// configure
const configure = require('./config.json');

// Use MiniCssExtractPlugin.loader
const { loader: miniLoader } = MiniCssExtractPlugin;

/**
 * generate a basic config
 * @param {string} nodeEnv process.env.NODE_ENV
 * @returns Webpack Chained Config
 */
function useBasicConfig(nodeEnv) {
    // node-env
    const isDev = nodeEnv.toLowerCase() === 'development';
    const isProduction = nodeEnv.toLowerCase() === 'production';

    // add css and css preprocessor loaders
    const { cssPreprocessors, isTsNeeded } = configure;

    const css = {
        test: /\.css$/i,
        include: resolve(__dirname, '../src'),
        exclude: /node_modules/,
        use: {
            styleLoader: {
                loader: isDev ? isDev ? 'style-loader' : miniLoader,
            },
            cssLoader: {
                loader: 'css-loader',
            },
            postcssLoader: {
                loader: 'postcss-loader',
            },
        },
    };

    const cssLoaders = {
        css,
    };

    const styleResource = {
        use: {
            styleResourceLoader: {
                loader: 'style-resources-loader',
                options: {
                    patterns: [
                        // use css
                        path.resolve(__dirname, '../src/assets/global.css'),
                    ],
                },
            }
        },
    };

    if (cssPreprocessors.includes('sass')) {
        const sass = Object.assign({}, { ...css }, { test: /\.s[ac]ss$/i });
        sass.use.sassLoader = {
            loader: 'sass-loader'
        };
        styleResource.styleResourceLoader.options.patterns = [
            // use scss
            path.resolve(__dirname, '../src/assets/_global.scss'),
        ];
        Object.assign(cssLoaders, { sass });
    }
    
    if (cssPreprocessors.includes('less')) {
        const less = Object.assign({}, { ...css }, { test: /\.less$/i });
        less.use.lessLoader = {
            loader: 'less-loader'
        };
        styleResource.styleResourceLoader.options.patterns = [
            // use less
            path.resolve(__dirname, '../src/assets/global.less'),
        ];
        Object.assign(cssLoaders, { less });
    }

    Object.assign(cssLoaders, { styleResource });

    // extensions that can be omitted
    const extensions = ['.js', '.jsx', '.json', '.cjs', '.mjs', '.ts', '.tsx'];

    // basic configure
    const mergedConf = {
        entry: {
            index: [resolve(__dirname, `../src/index.${isTsNeeded ? 't' : 'j'}sx`)],
        },
        output: {
            filename: '[name].[contenthash].bundle.js',
            path: resolve(__dirname, '../dist'),
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, '../src'),
            },
            extensions,
        },
        module: {
            rule: {
                jsx: {
                    test: /\.[jt]sx?$/i,
                    include: resolve(__dirname, '../src'),
                    exclude: /node_modules/,
                    use: {
                        babel: {
                            loader: 'babel-loader',
                            options: {
                                babelrc: false,
                                configFile: resolve(__dirname, '../babel.config.cjs'),
                            },
                        },
                    },
                },
                ...cssLoaders,
                pics: {
                    test: /\.(png|svg|jpe?g|gif)$/i,
                    type: 'asset/resource',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10 * 1024,
                        },
                    }
                },
                fonts: {
                    test: /\.(woff2?|eot|[ot]tf)$/i,
                    type: 'asset/resource'
                }
            },
        },
    };

    return new Config()
        .merge(mergedConf)
        // set plugins
        .plugin('HtmlWebpackPlugin')
        .use(HtmlWebpackPlugin, [
            {
                template: path.resolve(__dirname, '../public/index.htm'),
                inject: 'body',
            },
        ])
        .end()
        .plugin('DefinePlugin')
        .use(DefinePlugin, [
            {
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            },
        ])
        .end()
        // split chunks
        .optimization.splitChunks({
            chunks: 'all',
            minSize: 15000,
        })
        .end()
        // set in develoment mode
        .when(isDev, config => {
            config
                .devtool('source-map')
                .mode('development')
                // set devServer
                .devServer.compress(true)
                .port(8333)
                .hot(true)
                .open(false)
                .end();
            
            if (isTsNeeded) {
                // check ts in dev environment
                config.plugin('ForkTsCheckerWebpackPlugin')
                    .use(require('fork-ts-checker-webpack-plugin'), [
                        {
                            devServer: true,
                        },
                    ])
                    .end();
            }
            
            const { eslintUse } = configure;
            if (eslintUse) {
                config.plugin('ESLintPlugin')
                    .use(require('eslint-webpack-plugin'), [
                        {
                            extensions,
                            fix: true,
                            threads: true,
                        },
                    ])
                    .end();
            }
        })
        // set in production mode
        .when(isProduction, config => {
            config
                .devtool('eval')
                .mode('production')
                .optimization.minimize(true)
                .minimizer('terser')
                .use(TerserPlugin, [
                    {
                        extractComments: true,
                        minify: TerserPlugin.uglifyJsMinify,
                        terserOptions: {
                            ecma: 5,
                            compress: {
                                drop_console: true,
                                drop_debugger: true,
                            },
                        },
                    },
                ])
                .end()
                .end()
                // html webpack plugin
                .plugin('HtmlWebpackPlugin')
                .tap(args => {
                    const [htmlPluginConf] = args;
                    const appendToConf = {
                        ...htmlPluginConf,
                        minify: true,
                    };

                    return [appendToConf];
                })
                .end()
                // mini css extract plugin
                .plugin('MiniCssExtractPlugin')
                .use(MiniCssExtractPlugin, [
                    {
                        filename: '[name]-[contenthash].css',
                    },
                ])
                .end()
                .plugin('cleanWebpackPlugin')
                .use(CleanWebpackPlugin)
                .end();
        });
}

module.exports = {
    useBasicConfig,
};
