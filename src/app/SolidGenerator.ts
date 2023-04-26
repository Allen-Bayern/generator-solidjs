import { exit } from "process";
import Generator from "yeoman-generator";
import chalk from "chalk";

import { useQuestions } from "./utils/prompts";
import { useEndTranslations } from "./utils/config/EndTranslation";
import { UsedAnswers, UsedOptions } from "./utils/config/UsedTypes";

export const SolidGenerator = class extends Generator<UsedOptions> {
    private __replies: UsedAnswers | null = null;

    constructor(args: string | string[], opts: UsedOptions) {
        super(args, opts);

        // 应用名称作为可选argument传入
        this.argument("appname", {
            type: String,
            optional: true,
            description: "Set the name of the project.",
        });
    }

    initializing() {
        /**
         * developing...
         */
        console.log("A Solid.js generator using yeoman.");
    }

    async prompting() {
        try {
            this.__replies = await this.prompt(useQuestions(this.appname));
        } catch (error) {
            console.log(chalk.red(`Sorry, we meet some error and will quit! The error is: ${error}`));
            exit(1);
        }
    }

    configuring() {
        // 合并选项
        Object.assign(this.options, this.__replies);

        // 不使用当前文件夹的处理
        if (!this.options.isCurrentFolder && this.options.projectName) {
            const { projectName } = this.options;
            this.destinationRoot(this.destinationPath(projectName));
        }
    }

    writing() {}

    /**
     * @description install packages
     */
    install() {
        const { packageMamager } = this.options;
        if (!packageMamager || ["npm", "pnpm"].includes(packageMamager)) {
            const command = packageMamager || "pnpm";
            this.spawnCommand(command, ["install"]);
        } else if (packageMamager === "yarn") {
            this.spawnCommand(packageMamager, [""]);
        }
    }

    end() {
        const { firstPart, tips, lastPart } = useEndTranslations(this.options);

        firstPart.forEach(tip => {
            console.log(chalk.whiteBright(tip));
        });

        tips.forEach(tip => {
            console.log(chalk.yellowBright(tip));
        });

        lastPart.forEach(tip => {
            console.log(chalk.whiteBright(tip));
        });
    }
};
