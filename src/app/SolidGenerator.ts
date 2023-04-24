import Generator from "yeoman-generator";
import { questions } from "./utils/prompts";

export const SolidGenerator = class extends Generator {
    initializing(): void {
        this.prompt([...questions]).then(
            answers => {
                console.log(answers);
            }
        )
    }
};
