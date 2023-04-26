export class ListNode {


    //Need a parsing adapter here
    val : number;
    next : ListNode | null;

    constructor(val? : number, next? : ListNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.next = (next===undefined ? null : next);
    }
}