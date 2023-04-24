import Generator from "yeoman-generator";
import { getQuestions } from "./utils/prompts";

export const SolidGenerator = class extends Generator {
    constructor(args: string | string[], opts: Generator.GeneratorOptions) {
        super(args, opts);

        // 应用名称作为可选argument传入
        this.argument("appname", {
            type: String,
            optional: true,
            description: "Set the name of the project."
        });
    }

    initializing(): Promise<void> {
        return this.prompt(getQuestions(this.appname)).then(
            answers => {
                console.log(answers);
            }
        )
    }
};
