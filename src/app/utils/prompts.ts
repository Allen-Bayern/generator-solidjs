import type { Question } from "yeoman-generator";
import { kebabCase } from "lodash-es";

// 问题列表
import QuestionTranslation from './config/question-translation.json';

// Prefixes
const language = "[language]";
const feature = "[feature]";

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

// 语言&&问题列表
const { languages, questions } = QuestionTranslation;

export const getQuestions = (name?: string): Question<UsedAnswers>[] => ([
    // 问题: 使用中文还是英文
    {
        type: "list",
        name: "language",
        choices: [ ...languages ],
        default: "en",
        prefix: language,
        message: "Choose your language:"
    },
    // 问题: 应用名称
    {
        type: "input",
        when(): boolean {
            return !!name;
        },
        default: kebabCase(name) || 'solid-project',
        message({ language }): string {
            return questions[0][language as keyof typeof questions[0]] ?? questions[0].en;
        }
    },
    // 问题: 是否需要ts
    {
        type: "confirm",
        name: "isTsNeeded",
        default: true,
        prefix: feature,
        message({ language }): string {
            return questions[1][language as keyof typeof questions[1]] ?? questions[1].en;
        }
    },
    // 问题: 预装哪种CSS预处理器
    {
        type: "list",
        name: "cssPre",
        default: "sass",
        prefix: feature,
        choices: ["None", "sass", "less"].map(name => {
            const value = name.toLowerCase();
            return {
                name,
                value
            };
        }),
        message({ language }): string {
            return questions[2][language as keyof typeof questions[2]] ?? questions[2].en;
        }
    },
    // Eslint
    {
        type: "confirm",
        name: "Eslint",
        default: true,
        prefix: feature,
        message({ language }): string {
            return questions[3][language as keyof typeof questions[3]] ?? questions[3].en;
        }
    }
]);
