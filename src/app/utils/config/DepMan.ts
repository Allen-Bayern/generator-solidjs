import { UsedOptions } from "./UsedTypes";

interface DepVersions {
    dependencies: Record<string, string>;
    devDependencies?: Record<string, string>;
}

/**
 * 根据条件生成依赖
 * @param options 所有存储在yo中的选项
 * @returns 依赖列表
 */
export const useDependencies = (options: Partial<UsedOptions>): DepVersions => {
    const { isTsNeeded, cssPre } = options;

    /**
     * basic dependecies
     */
    const dependencies: Record<string, string> = {
        "solid-js": "^1.0.0",
        "@solidjs/router": "^0.7.0",
    };

    /**
     * basic devDependecies
     */
    const devDependencies: Record<string, string> = {
        "@babel/core": "^7.14.6",
        "@babel/plugin-proposal-class-properties": "^7.14.5",
        "@babel/plugin-proposal-object-rest-spread": "^7.14.7",
        "@babel/preset-env": "^7.14.7",
        autoprefixer: "^10.4.14",
        "babel-loader": "^9.1.2",
        "babel-preset-solid": "^1.0.0",
        "css-loader": "^6.7.3",
        "fork-ts-checker-webpack-plugin": "^8.0.0",
        "html-webpack-plugin": "^5.5.0",
        "mini-css-extract-plugin": "^2.7.5",
        postcss: "^8.4.21",
        "postcss-loader": "^7.2.4",
        "postcss-preset-env": "^8.3.0",
        "style-loader": "^3.3.2",
        "uglify-js": "^3.17.4",
        webpack: "^5.78.0",
        "webpack-chain": "^6.5.1",
        "webpack-cli": "^5.0.1",
        "webpack-dev-server": "^4.13.2",
    };

    if (isTsNeeded) {
        const tsDevDeps: Record<string, string> = {
            "@babel/preset-typescript": "^7.14.5",
            "fork-ts-checker-webpack-plugin": "^8.0.0",
            typescript: "^5.0.0",
        };
        Object.assign(devDependencies, tsDevDeps);
    }

    switch (cssPre) {
        case "sass" || "scss": {
            Object.assign(devDependencies, {
                sass: "^1.60.0",
                "sass-loader": "^13.0.0",
            });
            break;
        }
        case "less": {
            Object.assign(devDependencies, {
                less: "^4.0.0",
                "less-loader": "^11.0.0",
            });
            break;
        }
        default: {
            break;
        }
    }

    return {
        dependencies,
        devDependencies,
    };
};