import { UsedOptions } from "./UsedTypes";

export type WebpackConf = Partial<{
    [key: string]: unknown;
    entry: string | string[] | Record<string, string | string[]>;
    output: {
        [key: string]: unknown;
        path: string;
        filename: string;
    };
    resolve: {
        [key: string]: unknown;
        extensions: string[];
        alias: Record<string, string>;
    };
}>;

export function useBasicConf(options: UsedOptions): WebpackConf {
    const { isTsNeeded } = options;

    // 根据ts获取扩展名
    function getExtensions() {
        const basic = [".js", ".jsx", ".json", ".mjs"];
        if (isTsNeeded) {
            basic.push(...[".ts", ".tsx"]);
        }

        return basic;
    }

    const conf: WebpackConf = {
        entry: `./src/index.${isTsNeeded ? "t" : "j"}sx`,
        output: {
            filename: "[name].[contenthash].bundle.js",
            path: "./dist",
        },
        resolve: {
            alias: {
                "@": "./src",
            },
            extensions: getExtensions(),
        },
    };

    return conf;
}
