import * as fs from 'fs-extra';
import yargs from 'yargs';
import path from "path";

const configDir = 'config';
const configFilePath = `${configDir}/problemConfig.json`;


interface ProblemData {
    completed: boolean;
    name: string;
    startTime : number;
    pauseTime: number;
    elapsedTime: number;
}


interface ConfigData {
    [problemNumber: string]: ProblemData;
}


async function loadConfig():Promise<ConfigData> {
    const configData = await fs.readJSON(configFilePath);
    return configData;
}


async function saveConfig(configData: ConfigData) {
    await fs.ensureDir(configDir);
    await fs.writeJSON(configFilePath, configData, { spaces: 2 });
}

async function start(problemNumber: string) {
    const configData = await loadConfig();

    if (configData.hasOwnProperty(problemNumber)) {
        console.log("Resuming timer for problem", problemNumber);
    } else {
        console.log("Starting timer for problem", problemNumber);
    }

    configData[problemNumber] = {completed: false, name : '', startTime: Date.now(), pauseTime: 0, elapsedTime: 0};

    console.log(`Timer started for problem ${problemNumber}`);
    await saveConfig(configData);
}


async function pause(problemNumber: string) {
    const configData = await loadConfig();

    if (!configData.hasOwnProperty(problemNumber)) {
        console.log(`Time data for problem ${problemNumber} not found`);
        return;
    }


    if (configData[problemNumber].startTime === null) {
        console.log("Timer has been started yet for the problem number", problemNumber);
        return;
    }

    if (configData[problemNumber].pauseTime === null) {
        configData[problemNumber].pauseTime = Date.now();
        configData[problemNumber].elapsedTime += configData[problemNumber].pauseTime - configData[problemNumber].startTime;
        console.log("Timer paused for problem", problemNumber);
    } else {
        console.log(`Timer for problem ${problemNumber} has already been paused. Use --resume to resume the timer.`);
    }

    await saveConfig(configData);
}

async function resume(problemNumber: string) {
    const configData = await loadConfig();

    if (!configData.hasOwnProperty(problemNumber)) {
        console.log(`Timer data for problem ${problemNumber} does not exist`);
        return;
    }


    if (configData[problemNumber].startTime === null) {
        console.log("Timer has been started yet for the problem number", problemNumber);
        return;
    }


    if (configData[problemNumber].pauseTime !== null) {
        configData[problemNumber].startTime = Date.now();
        configData[problemNumber].pauseTime = 0;
        console.log("Timer resumed for problem", problemNumber);
    } else {
        console.log(`Timer for problem ${problemNumber} has not been paused. Use --pause to pause the timer.`);
    }

    await saveConfig(configData);
}


async function done(problemNumber: string) {
    const configData = await loadConfig();

    if (!configData.hasOwnProperty(problemNumber)) {
        console.log(`Time data for problem ${problemNumber} does not exist`);
        return;
    }

    if (configData[problemNumber].startTime === null) {
        console.log("Timer has been started yet for the problem number", problemNumber);
        return;
    }

    if (configData[problemNumber].pauseTime !== null) {
        configData[problemNumber].elapsedTime += configData[problemNumber].pauseTime - configData[problemNumber].startTime;
    } else {
        configData[problemNumber].elapsedTime += Date.now() - configData[problemNumber].startTime;
    }


    configData[problemNumber].completed = true;
    await saveConfig(configData);

    console.log(`Timer done for problem ${problemNumber}. Total time elapsed: ${configData[problemNumber].elapsedTime /1000 } s`);


    await writeTime(problemNumber, configData[problemNumber].elapsedTime);

    }


    async function writeTime(problemName:  string, elapseTime: number) {
    const problemPath = path.join('src', problemName);

    const problemFiles = await fs.readdir(problemPath);

    for (const file of problemFiles) {
        if (path.extname(file) === '.ts') {
            const baseFileName = path.basename(file, '.ts');
            const problemFilePath = path.join(problemPath, file);


            let problemCode = await fs.readFile(problemFilePath, 'utf-8');
            const match = problemCode.match(/\/\/ time:\s*(d+)\s*ms/i);

            if (match !== null) {
                console.log(`Updating time for problem ${problemName}: ${baseFileName}`)
                problemCode = problemCode.replace(/\/\/ time:\s*(d+)\s*ms/i, `// time: ${elapseTime / 1000} s`);
            } else {
                console.log("Adding time for problem", problemName, baseFileName);
                problemCode += `\n\n// time: ${elapseTime / 1000} s`;
            }

            await fs.writeFile(problemFilePath, problemCode, 'utf-8');
        }
    }
    }


const argv = yargs(process.argv.slice(2))
    .command('start <problemNumber>', "Start the timer for the problem number", {}, (argv) => pause(argv.problemNumber as string))
    .command('pause <problemNumber>', "Pause the timer for the problem number", {}, (argv) => pause(argv.problemNumber as string))
    .command('resume <problemNumber>', "Resume the timer for the problem number", {}, (argv) => resume(argv.problemNumber as string))
    .command('done <problemNumber>', "Stop the timer for the problem number", {}, (argv) => done(argv.problemNumber as string))
    .help()
    .alias('h', 'help')
    .argv as any;

