class Cons {
    constructor(head, tail) {
        this.head = head;
        this.tail = tail;
    }
}

export default class {
    constructor() {
        this.root = null;
    }
    add(delay) {
        this.root = new Cons(delay, this.root);
    }
    tick(delta) {
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