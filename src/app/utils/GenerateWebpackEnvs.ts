import { UsedOptions } from "./config/UsedTypes";

export function useWebpackEnv(options: UsedOptions) {
    const { cssPre, eslintUse = true, isTsNeeded = true } = options;
    const cssPreprocessors = ["css"];
    if (cssPre?.toLocaleLowerCase() === "sass" || cssPre?.toLocaleLowerCase() === "scss") {
        cssPreprocessors.push("sass");
    } else if (cssPre?.toLocaleLowerCase() === "less") {
        cssPreprocessors.push("less");
    }

    return {
        cssPreprocessors,
        eslintUse,
        isTsNeeded,
    };
}
