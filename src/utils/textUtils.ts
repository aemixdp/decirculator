export function snakeToCamel(s: string): string {
    return s.replace(/(-.)/g, (m) => m[1].toUpperCase());
}

export function offset(n: number, ...offsets: number[]): number {
    return offsets[Math.max(`${n}`.length - 1, 0)] || offsets[offsets.length - 1];
}

export function mangle(s: string): string {
    const words = [];
    let word = '';
    for (let i = 0; i < s.length; ++i) {
        if (s[i] === s[i].toUpperCase()) {
            if (word.length > 0) words.push(word);
            word = s[i].toLowerCase();
        } else {
            word += s[i];
        }
    }
    if (word.length > 0) words.push(word);
    return words.join('-');
}
