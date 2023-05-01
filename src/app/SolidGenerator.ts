import { exit } from "process";
import Generator from "yeoman-generator";
import chalk from "chalk";

import { useQuestions } from "./utils/prompts";
import { useEndTranslations } from "./utils/config/EndTranslation";
import Translations from "./utils/config/question-translation.json";
import { usePackageJson } from "./utils/GeneratePackageJson";
import { useWebpackEnv } from "./utils/GenerateWebpackEnvs";
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

    /**
     * @description writing method
     */
    writing() {
        this.sourceRoot();

        const { isTsNeeded } = this.options;

        // generate extensions
        const extName = `.${isTsNeeded ? "t" : "j"}sx`;

        // writing html
        const { language, projectName = "solid-project" } = this.options;
        const mapLanguages = languages.reduce((prev, cur) => {
            const { value, iso } = cur;
            prev[value] = iso;
            return prev;
        }, {} as Record<string, string>);

        this.fs.copyTpl(this.templatePath("index.htm"), this.destinationPath("public/index.htm"), {
            lang: mapLanguages[language ?? "en"],
            projectName,
        });

        // package.json
        this.fs.writeJSON(this.destinationPath("package.json"), usePackageJson(this.options), void 0, 4);

        // babel.config
        this.fs.copy(
            this.templatePath(isTsNeeded ? "babel/babel.with-ts.js" : "babel/babel.basic.js"),
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

        // write "homeview"
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

        // write css assets
        if (/s[ac]ss/i.test(cssPre)) {
            this.fs.copy(this.templatePath("assets/_global.scss"), this.destinationPath("assets/_global.scss"));
        } else if (cssPre === "less") {
            this.fs.copy(this.templatePath("assets/global.less"), this.destinationPath("assets/global.less"));
        } else {
            this.fs.copy(this.templatePath("assets/global.css"), this.destinationPath("assets/global.css"));
        }

        // write "about"
        this.fs.copy(
            this.templatePath("views/AboutPage/index.jsx"),
            this.destinationPath(`src/views/AboutPage/index${extName}`)
        );

        // write App
        this.fs.copy(this.templatePath("App.jsx"), this.destinationPath(`src/App${extName}`));

        // write index
        this.fs.copy(this.templatePath("index.jsx"), this.destinationPath(`src/index${extName}`));

        // write editorconfig
        this.fs.copy(this.templatePath("tools/__editorconfig"), this.destinationPath(".editorconfig"));

        // postcss
        this.fs.copy(this.templatePath("tools/__postcssrc.js"), this.destinationPath("postcss.config.cjs"));

        // eslint & stylelint
        const { eslintUse, stylelintUse } = this.options;

        if (eslintUse || stylelintUse) {
            this.fs.copy(this.templatePath("tools/__prettierrc.yaml"), this.destinationPath("prettierrc.yml"));
        }

        if (eslintUse) {
            this.fs.copy(this.templatePath("tools/__eslintrc.cjs"), this.destinationPath(".eslintrc.cjs"));
        }

        if (stylelintUse) {
            this.fs.copy(this.templatePath("tools/__stylelintrc"), this.destinationPath(".stylelintrc.cjs"));
        }

        // .gitignore
        this.fs.copy(this.templatePath("tools/__gitignore"), this.destinationPath(".gitignore"));

        // write webpacks
        this.fs.writeJSON(this.destinationPath("webpack/config.json"), useWebpackEnv(this.options), void 0, 4);
        this.fs.copy(this.templatePath("webpack/BasicConf.js"), this.destinationPath("webpack/BasicConf.js"));
        this.fs.copy(this.templatePath("webpack.config.js"), this.destinationPath("webpack.config.js"));
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
