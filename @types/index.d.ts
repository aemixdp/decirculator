declare module 'react-input-autosize';

declare module 'fastpriorityqueue' {
    export default class <T> {
        constructor(cmp?: (a: T, b: T) => boolean);
        add(elem: T): void;
        peek(): T | undefined;
        poll(): T | undefined;
    }
}

interface Element {
    blur(): void;
}