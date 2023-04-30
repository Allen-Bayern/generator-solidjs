import { exit } from "process";
import Generator from "yeoman-generator";
import chalk from "chalk";

import { useQuestions } from "./utils/prompts";
import { useEndTranslations } from "./utils/config/EndTranslation";
import Translations from "./utils/config/question-translation.json";
import { usePackageJson } from "./utils/config/GeneratePackageJson";
import type { UsedAnswers, UsedOptions } from "./utils/config/UsedTypes";

const { languages } = Translations;

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

    writing() {
        this.sourceRoot();

        const { isTsNeeded } = this.options;

        // generate extensions
        const extName = `.${isTsNeeded ? "t" : "j"}sx`;

        // writing html
        const { language } = this.options;
        const mapLanguages = languages.reduce((prev, cur) => {
            const { value, iso } = cur;
            prev[value] = iso;
            return prev;
        }, {} as Record<string, string>);

        this.fs.copyTpl(this.templatePath("index.htm"), this.destinationPath("public/index.htm"), {
            lang: mapLanguages[language ?? "en"],
        });

        // package.json
        this.fs.writeJSON(this.destinationPath("package.json"), usePackageJson(this.options), void 0, 4);

        // babel.config
        this.fs.copy(
            this.templatePath(isTsNeeded ? "babel/babel.with-ts.js" : "babel/babel/basic.js"),
            this.destinationPath("babel.config.cjs")
        );

        // write route
        this.fs.copy(this.templatePath("routes/index.jsx"), this.destinationPath(`src/routes/index${extName}`));

        // write views
        const { cssPre = "none" } = this.options;
        const none = ["views/HomePage/index.jsx", "views/HomePage/style.css"];
        const sass = ["views/HomePage/WithSass.jsx", "views/HomePage/_style.scss"];
        const less = ["views/HomePage/WithLess.jsx", "views/HomePage/style.less"];

        const pathDict = {
            none,
            css: [...none],
            sass,
            scss: [...sass],
            less,
        };

        pathDict[cssPre.toLowerCase() as keyof typeof pathDict].forEach(element => {
            const destPath = `src/${element
                .split("/")
                .map((item, index) => {
                    if (!index) return item;
                    else {
                        const templateExt = item.split(".")[1];
                        if (templateExt.toLowerCase() === "jsx") {
                            return `index${extName}`;
                        }
                        return item;
                    }
                })
                .join("/")}`;
            this.fs.copy(this.templatePath(element), this.destinationPath(destPath));
        });

        // write "about"
        this.fs.copy(
            this.templatePath("views/AboutPage/index.jsx"),
            this.destinationPath(`src/views/AboutPage/index${extName}`)
        );

        // write App
        this.fs.copy(this.templatePath("App.jsx"), this.destinationPath(`src/App${extName}`));

        // write index
        this.fs.copy(this.templatePath("index.jsx"), this.destinationPath(`src/index${extName}`));
    }

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
