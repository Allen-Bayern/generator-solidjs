import { GeneratorOptions } from "yeoman-generator";

// 答案类型
export interface UsedAnswers {
    // 语言
    language: string;
    // 应用名称
    projectName: string;
    // 是否用TS
    isTsNeeded: boolean;
    // css预处理器
    cssPre: string;
    // Eslint
    eslintUse: boolean;
    // stylelint
    stylelintUse: boolean;
    // PM
    packageMamager: string;
    // 是否使用当前文件夹?
    isCurrentFolder: boolean;
}

export interface UsedOptions extends GeneratorOptions, Partial<UsedAnswers> {}
