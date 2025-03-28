//Capitalize the first letter of each word
export function capitalizeWords(text: string) {
    if (!text) return "";
    const words = text.replace(/\b[a-z]/gi, (match) => match.toUpperCase());
    return words;
}

export function capitalizeFirstLetterOfEachSentence(text: string) {
    if (!text) return "";
    const words = text.replace(/(^|\.\s+)[a-z]/g, (match) => match.toUpperCase());
    return words;
}