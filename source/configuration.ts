import { join } from 'node:path';
import { readdir } from "node:fs/promises";

export class Configuration {
    eventId: string;
    uploadedFolder: string;
    watchFolder: string;

    private static instance: Configuration | null = null;
    static configPath = join(process.cwd(), 'app.config.json');

    private constructor(eventId: string, uploadedFolder: string, watchFolder: string) {
        this.eventId = eventId;
        this.uploadedFolder = uploadedFolder;
        this.watchFolder = watchFolder;
    }

    static async getInstance(): Promise<Configuration> {
        if (Configuration.instance) {
            return Configuration.instance;
        }

        const configExists = await Bun.file(Configuration.configPath).exists();
        if (configExists) {
            const data = await Bun.file(Configuration.configPath).json();
            if (!(await Configuration.checkFolder(data.watchFolder, 'watch for new files')) ||
                !(await Configuration.checkFolder(data.uploadedFolder, 'move uploaded files to'))) {
                Configuration.instance = await Configuration.promptForConfiguration();
                await Bun.write(Configuration.configPath, JSON.stringify(Configuration.instance, null, 4));
                return Configuration.instance;
            }
            Configuration.instance = new Configuration(data.eventId, data.uploadedFolder, data.watchFolder);
            return Configuration.instance;
        }

        Configuration.instance = await Configuration.promptForConfiguration();
        await Bun.write(Configuration.configPath, JSON.stringify(Configuration.instance, null, 4));
        console.log('✅ app.config.json created.');
        return Configuration.instance;
    }

    private static async checkFolder(folder: string, description: string): Promise<boolean> {
        try {
            await readdir(folder);
            return true;
        } catch {
            console.log(`❌ Folder to ${description} does not exist: ${folder}`);
            return false;
        }
    }

    private static async promptForConfiguration(): Promise<Configuration> {
        const eventId = await prompt('Enter Event ID: ');
        const watchFolder = await prompt('Enter folder to watch for new files: ', true);
        const uploadedFolder = await prompt('Enter folder to move uploaded files to: ', true);

        return new Configuration(eventId, uploadedFolder, watchFolder);
    }
}

async function prompt(question: string, checkFolder: boolean = false): Promise<string> {
    process.stdout.write(question);
    return new Promise((resolve) => {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.once('data', async (data) => {
            process.stdin.pause();
            const input = data.toString().trim();
            if (checkFolder) {
                try {
                    await readdir(input);
                } catch {
                    console.error(`❌ The folder does not exist: ${input}`);
                    resolve(await prompt(question, checkFolder));
                    return;
                }
            }
            resolve(input);
        });
    });
}