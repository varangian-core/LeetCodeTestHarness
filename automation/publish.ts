import * as fs from 'fs-extra';
import * as path from 'path';
import yargs, {options} from 'yargs';


const argv = yargs(process.argv.slice(2))
.options({
    p: {
        alias: 'platform',
        describe: 'Problem corresponds to which platform',
        choices: ['leetcode', 'hackerrank', 'codeforces'],
        default: 'leetcode',
        type: 'string'
    },
})
.help()
    .alias('h', 'help')
    .argv as any;

const srcDir = 'src';
const targetDir = path.join('content', argv.platform);

async function main() {
    await processDirectory(srcDir);
}

async function processDirectory(directory: string) {
    const items = await fs.readdir(directory);

    for (const item of items) {
        const itemPath = path.join(directory, item);
        const itemStat = await fs.stat(itemPath);

        if (itemStat.isDirectory() && /^\d+$/.test(item)) {
            console.log('Processing problem directory:', itemPath);
            await processProblemDirectory(itemPath, item);
        }
    }
}

async function processProblemDirectory(directory: string, problemNumber: string) {
    const problemFiles = await fs.readdir(directory);

    for (const fileName of problemFiles) {
        if (path.extname(fileName) === '.ts') {
            const baseFileName = path.basename(fileName, '.ts');
            console.log('Processing solution file:', path.join(directory, fileName));
            await processSolution(directory, problemNumber, baseFileName);
        }
    }
}

async function processSolution(directory: string, problemNumber: string, baseFileName: string) {
    const tsFilePath = path.join(directory, `${baseFileName}.ts`);
    const mdFilePath = path.join(targetDir, `${problemNumber}_${baseFileName}.md`);

    let tsCode = await fs.readFile(tsFilePath, 'utf-8');

    tsCode = tsCode.replace(/export function (\w+)(\w*)\(/, (_, p1, p2) => {
        const camelCaseFunctionName = `${p1}${p2.charAt(0).toLowerCase()}${p2.slice(1)}`;
        return `function ${camelCaseFunctionName}(`;
    });

    tsCode = tsCode.replace(/import {[^}]*} from '..\/..\/structures\/[^']*';\n/g, '');

    const mdCode = '```typescript\n' + tsCode + '\n```';

    const frontMatter = `---
title: "${problemNumber}_${baseFileName}"
date: ${new Date().toISOString()}
tags: ["leetcode", "algorithm", "TypeScript"]
---
`;

    const mdContent = frontMatter + '\n' + mdCode;

    await fs.ensureDir(targetDir);

    await fs.writeFile(mdFilePath, mdContent, 'utf-8');

    console.log(`Solution published: ${mdFilePath}`);
}

main().catch((error) => {
    console.error('Error:', error);
});
