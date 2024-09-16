
//Capitalize the first letter of each word
export function capitalizeWords(text: string) {
    return text.replace(/\b[a-z]/gi, (match) => match.toUpperCase());
}

export function capitalizeFirstLetterOfEachSentence(text: string) {
    return text.replace(/(^|\.\s+)[a-z]/g, (match) => match.toUpperCase());
}