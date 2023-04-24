import { UsedOptions } from "./UsedTypes";

/**
 * 生成一组结束语
 * @param options 
 * @returns 
 */
export const useEndTranslations 
    = <T extends UsedOptions = UsedOptions> (options: T) => 
{
    const { projectName = 'solid-project', language = 'en' } = options;
    const firstPart = [] as string[];

    function line1 (): string {
        switch (language.toLowerCase()) {
            case "zhcn": {
                return `恭喜！项目${projectName}已创建完毕！`;
            }
            default: {
                return `Congratulations! The project ${projectName} has been created successfully!`;
            }
        }
    }
    firstPart.push(line1());

    function line2 (): string {
        switch (language.toLowerCase()) {
            case "zhcn": {
                return "接下来, 您可以这样操作: ";
            }
            default: {
                return "Then, run: ";
            }
        }
    }
    firstPart.push(line2());

    const tips = [`cd ${projectName}`, "pnpm install"];

    const lastPart = [] as string[];

    function last1(): string {
        switch (language.toLowerCase()) {
            case "zhcn": {
                return "用yarn和npm也可以";
            }
            default: {
                return "You can also use yarn or npm";
            }
        }
    }
    lastPart.push(last1());

    return {
        firstPart,
        tips,
        lastPart
    };
}
