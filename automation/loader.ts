import * as fs from 'fs';
import * as path from 'path';

const getProblemName = (): { problemNumber: string, problemName: string } => {
    const data = fs.readFileSync('problem.txt', 'utf-8');
    const firstLine = data.split('\n')[0].trim();
    const [problemNumber, problemName] = firstLine.split('.');
    return { problemNumber, problemName };
}

const createFiles = (problemNumber: string, problemName: string): void => {
    problemName = sanitize(problemName);
    const srcDir = path.join('src', problemNumber);
    const testDir = path.join('test', '__tests__', problemNumber);
    const srcFile = path.join(srcDir, `${problemName}.ts`);
    const testFile = path.join(testDir, `${problemName}.spec.ts`);

    if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir);
    }

    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir);
    }

    const structuresDir = path.join('.', 'structures');
    const structureFiles = fs.readdirSync(structuresDir);
    let importStatements = '';

    structureFiles.forEach(file => {
        if (file.endsWith('.ts')) {
            const fileName = file.replace('.ts', '');
            importStatements += `import { ${fileName} } from '../../structures/${fileName}';\n`;
        }
    });

    fs.writeFileSync(srcFile, importStatements);
    fs.writeFileSync(testFile, '');
}

const sanitize = (str: string): string => {
    return str.replace(/\s/g, '');
}

const readProblemInfo = (): { problemName: string, examples: Array<any> } => {
    const data = fs.readFileSync('problem.txt', 'utf-8');
    const lines = data.split('\n').map(line => line.trim());

    let problemName = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('1.')) {
            problemName = line.split('.')[1].trim();
            break;
        }
    }

    const content = lines.slice(1).join('\n');
    const { inputContent, outputContent } = extractContent(content);

    console.log('Input content:', inputContent);
    console.log('Output content:', outputContent);
    const examples = inputContent.map((input, index) => [input, outputContent[index]]);
    console.log('Examples:', examples);

    return { problemName, 'examples': examples };
}

const createJestTestCases = (
    problemName: string,
    problemNumber: string,
    examples: Array<[string, string]>
): string => {
    problemName = problemName.replace(/\d/, (digit, index) => {
        const isDigitFirstChar = index === 0;

        switch (digit) {
            case '0':
                return isDigitFirstChar ? 'zero' : 'Zero';
            case '1':
                return isDigitFirstChar ? 'one' : 'One';
            case '2':
                return isDigitFirstChar ? 'two' : 'Two';
            case '3':
                return isDigitFirstChar ? 'three' : 'Three';
            case '4':
                return isDigitFirstChar ? 'four' : 'Four';
            case '5':
                return isDigitFirstChar ? 'five' : 'Five';
            case '6':
                return isDigitFirstChar ? 'six' : 'Six';
            case '7':
                return isDigitFirstChar ? 'seven' : 'Seven';
            case '8':
                return isDigitFirstChar ? 'eight' : 'Eight';
            case '9':
                return isDigitFirstChar ? 'nine' : 'Nine';
            default:
                return '';
        }
    });

    const importStatement = `import { ${problemName} } from "../../../src/${problemNumber}/${problemName}";\n\n`;
    let testCases = importStatement;

    examples.forEach(([input, output], index) => {
        const inputValues = input
            .replace(/(\w+)\s*=\s*/g, '')
            .split(',')
            .map(val => val.trim());
        const expectedOutput = (output === 'true' || output === 'false') ? output : JSON.stringify(output);

        testCases += `test('${problemName} Test Case ${index + 1}', () => {\n`;
        testCases += `  expect(${problemName}(${inputValues.join(',')})).toBe(${expectedOutput});\n`;
        testCases += `});\n\n`;
    });

    return testCases;
};



const appendExamplesToTestFile = (testFile: string, problemName: string, problemNumber: string, examples: Array<[string, any]>) => {
    const testCases = createJestTestCases(problemName, problemNumber, examples);
    fs.writeFileSync(testFile, testCases);
}


function extractContent(text: string): { inputContent: string[], outputContent: string[] } {
    const inputPattern = /Input:([\s\S]*?)Output:/g;
    const outputPattern = /Output:([\s\S]*?)(?=Explanation:|Constraints:|Example|$)/g;

    const inputMatches = Array.from(text.matchAll(inputPattern));
    const outputMatches = Array.from(text.matchAll(outputPattern));

    const inputContent = inputMatches.map(match => match[1].trim());
    const outputContent = outputMatches.map(match => match[1].trim());

    return { inputContent, outputContent };
}

function main() {
    const { problemNumber, problemName } = getProblemName();
    createFiles(problemNumber, problemName);
    const sanitizedProblemName = sanitize(problemName);
    const testDir = path.join('test', '__tests__', problemNumber);
    const testFile = path.join(testDir, `${sanitizedProblemName}.spec.ts`);
    const { examples } = readProblemInfo();
    appendExamplesToTestFile(testFile, sanitizedProblemName, problemNumber, examples);
}

main();

