// @flow

class Cons<T> {
    head: T;
    tail: Cons<T> | null;
    constructor(head: T, tail: Cons<T> | null) {
        this.head = head;
        this.tail = tail;
    }
}

export default class DelayList {
    root: Cons<number> | null;
    constructor() {
        this.root = null;
    }
    add(delay: number): void {
        this.root = new Cons(delay, this.root);
    }
    tick(delta: number): boolean {
        let prevNode = null;
        let currNode = this.root;
        while (currNode) {
            currNode.head -= delta;
            if (currNode.head <= 0) {
                if (prevNode) {
                    prevNode.tail = null;
                } else {
                    this.root = null;
                }
                return true;
            }
            prevNode = currNode;
            currNode = currNode.tail;
        }
        return false;
    }
}