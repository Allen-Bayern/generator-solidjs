// Copyright (c) Wictor Wilén. All rights reserved.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const fs = require("fs-extra");

const nodeModules = {};
fs.readdirSync("node_modules")
    .filter((x) => [".bin"].indexOf(x) === -1)
    .forEach((mod) => {
        nodeModules[mod] = "commonjs " + mod;
    });

const config = [
    {
        entry: {
            app: [__dirname + "/src/app/index.ts"],
            bot: [__dirname + "/src/bot/index.ts"],
            tab: [__dirname + "/src/tab/index.ts"],
            custombot: [__dirname + "/src/custombot/index.ts"],
            connector: [__dirname + "/src/connector/index.ts"],
            messageExtension: [__dirname + "/src/messageExtension/index.ts"],
            localization: [__dirname + "/src/localization/index.ts"],
        },
        output: {
            path: __dirname + "/generators/",
            filename: "[name]/index.js",
            libraryTarget: "umd",
        },
        externals: nodeModules,
        devtool: "source-map",
        mode: "production",
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
            alias: {},
        },
        target: "node",
        node: {
            __dirname: false,
            __filename: false,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: [/lib/, /dist/, /templates/, /temp-templates/],
                    use: [
                        {
                            loader: "ts-loader",
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "src/app/templates",
                        to: "app/templates",
                        info: { minimized: true },
                    },
                    {
                        from: "src/app/USAGE",
                        to: "app",
                        info: { minimized: true },
                    },
                    {
                        from: "src/tab/templates",
                        to: "tab/templates",
                        info: { minimized: true },
                    },
                    {
                        from: "src/bot/templates",
                        to: "bot/templates",
                        info: { minimized: true },
                    },
                    {
                        from: "src/custombot/templates",
                        to: "custombot/templates",
                        info: { minimized: true },
                    },
                    {
                        from: "src/connector/templates",
                        to: "connector/templates",
                        info: { minimized: true },
                    },
                    {
                        from: "src/messageExtension/templates",
                        to: "messageExtension/templates",
                        info: { minimized: true },
                    },
                ],
            }),
        ],
    },
];

module.exports = config;
