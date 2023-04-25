function extractContent(text: string): { inputContent: string[], outputContent: string[] } {
    const inputPattern = /Input:([\s\S]*?)Output:/g;
    const outputPattern = /Output:([\s\S]*?)(?=Explanation:|Constraints:|Example|$)/g;

    const inputMatches = Array.from(text.matchAll(inputPattern));
    const outputMatches = Array.from(text.matchAll(outputPattern));

    const inputContent = inputMatches.map(match => match[1].trim());
    const outputContent = outputMatches.map(match => match[1].trim());

    return { inputContent, outputContent };
}

const stdout = `CONTENTInput: x = 121Output: trueExplanation: 121 reads as 121 from left to right and from right to left.Example 2:Input: x = -121Output: falseExplanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.Example 3:Input: x = 10Output: falseExplanation: Reads 01 from right to left. Therefore it is not a palindrome.Constraints:-231 <= x <= 231 - 1
MODIFIEDInput, x = 121Output, trueExplanation, 121 reads as 121 from left to right and from right to left.Example 2,Input, x = -121Output, falseExplanation, From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.Example 3,Input, x = 10Output, falseExplanation, Reads 01 from right to left. Therefore it is not a palindrome.Constraints,-231 <= x <= 231 - 1`;

const extractedContent = extractContent(stdout);
console.log('Input content:', extractedContent.inputContent);
console.log('Output content:', extractedContent.outputContent);
