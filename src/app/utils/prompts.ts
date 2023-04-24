import type { Question } from "yeoman-generator";

// Prefixes
const language = "[language]";
const feature = "[feature]";

interface UsedAnswers {
    // 语言
    language: string;
    // 是否用TS
    isTsNeeded: boolean;
}

export const questions: Question<UsedAnswers>[] = [
    // 问题一: 使用中文还是英文
    {
        type: "list",
        name: "language",
        choices: [
            {
                name: "English",
                value: "en",
            },
            {
                name: "中文",
                value: "zhCn",
            }
        ],
        default: "en",
        prefix: language,
        message: "Choose your language:"
    },
    // 问题二: 是否需要ts
    {
        type: "confirm",
        name: "isTsNeeded",
        default: true,
        prefix: feature,
        message({ language }) {
            switch(language) {
                case "zhCn": {
                    return "是否使用TypeScript? ";
                }
                default: {
                    return "Use TypeScript? ";
                }
            }
        }
    }
];
