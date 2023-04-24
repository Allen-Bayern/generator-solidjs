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
}

export interface UsedOptions extends GeneratorOptions, Partial<UsedAnswers> {

}
