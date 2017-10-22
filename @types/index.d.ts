declare module 'react-input-autosize';

declare module 'fastpriorityqueue' {
    export default class <T> {
        add(elem: T): void;
        peek(): T | undefined;
        poll(): T | undefined;
    }
}