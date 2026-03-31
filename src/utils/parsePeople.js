export function parsePeople(text) {
    if (!text) return [];

    const matches = text.match(/@(\w+)/g);
    if (!matches) return [];
    return [...new Set(matches.map(match => match.slice(1)))]
}