import Generator from "yeoman-generator";
import { getQuestions, UsedAnswers } from "./utils/prompts";

export const SolidGenerator = class extends Generator {
    private __replies: UsedAnswers | null = null;

    constructor(args: string | string[], opts: Generator.GeneratorOptions) {
        super(args, opts);

        // 应用名称作为可选argument传入
        this.argument("appname", {
            type: String,
            optional: true,
            description: "Set the name of the project."
        });
    }

    initializing() {
        /**
         * developing...
         */
    }

    async prompting() {
        this.__replies = await this.prompt(getQuestions(this.appname));
    }
};
