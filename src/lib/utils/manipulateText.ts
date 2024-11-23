export function truncateText(text: string, maxLength: number = 100): string {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export function removeSpaces(text: string): string {
    return text.replace(/[\n\r]+/g, " ");
}