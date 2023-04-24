import type { Question } from "yeoman-generator";

export const questions: Question[] = [
    // 问题一: 使用中文还是英文
    {
        type: "list",
        choices: [
            {
                name: "English",
                value: "en",
            },
            {
                name: "中文",
                value: "cn",
            }
        ],
        default: "en",
        prefix: "[language]",
        message: "Choose your language: "
    },
];
