import type { Question } from "yeoman-generator";
import { kebabCase } from "lodash-es";

// 问题列表
import QuestionTranslation from "./config/question-translation.json";

// 答案类型
import type { UsedAnswers } from "./config/UsedTypes";

// Prefixes
const language = "[language]";
const feature = "[feature]";

// 语言&&问题列表
const { languages, questions } = QuestionTranslation;

/**
 * 生成问题
 * @param name 项目名称, 默认为空，以便在没有输入参数时提示输入项目名称
 * @returns 问题列表
 */
export const useQuestions = (name = ""): Question<UsedAnswers>[] => [
    // 问题: 使用中文还是英文
    {
        type: "list",
        name: "language",
        choices: languages.map(({ name, value }) => ({ name, value })),
        default: "en",
        prefix: language,
        message: "Choose your language:",
    },
    // 问题: 项目名称
    {
        type: "input",
        name: "projectName",
        when(): boolean {
            return !!name;
        },
        default: kebabCase(name) || "solid-project",
        message({ language }): string {
            return questions[0][language as keyof (typeof questions)[0]] ?? questions[0].en;
        },
    },
    // 问题: 是否需要ts
    {
        type: "confirm",
        name: "isTsNeeded",
        default: true,
        prefix: feature,
        message({ language }): string {
            return questions[1][language as keyof (typeof questions)[1]] ?? questions[1].en;
        },
    },
    // 问题: 预装哪种CSS预处理器
    {
        type: "list",
        name: "cssPre",
        default: "sass",
        prefix: feature,
        choices: ["None", "sass", "less"].map(name => ({
            name,
            value: name.toLowerCase(),
        })),
        message({ language }): string {
            return questions[2][language as keyof (typeof questions)[2]] ?? questions[2].en;
        },
    },
    // Eslint
    {
        type: "confirm",
        name: "eslintUse",
        default: true,
        prefix: feature,
        message({ language }): string {
            return questions[3][language as keyof (typeof questions)[3]] ?? questions[3].en;
        },
    },
    // stylelint
    {
        type: "confirm",
        name: "stylelintUse",
        default: true,
        prefix: feature,
        message({ language }): string {
            return questions[4][language as keyof (typeof questions)[4]] ?? questions[4].en;
        },
    },
    // PM
    {
        type: "list",
        name: "packageMamager",
        default: "pnpm",
        prefix: feature,
        message({ language }): string {
            return questions[5][language as keyof (typeof questions)[5]] ?? questions[5].en;
        },
        choices: ["pnpm", "npm", "yarn"].map(name => ({
            name,
            value: name.toLowerCase(),
        })),
    },
    // 是否使用当前文件夹?
    {
        type: "confirm",
        name: "isCurrentFolder",
        default: true,
        prefix: feature,
        message({ language }): string {
            return questions[6][language as keyof (typeof questions)[6]] ?? questions[6].en;
        },
    },
];
