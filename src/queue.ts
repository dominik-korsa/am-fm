interface Item<T> {
  next: Item<T> | undefined;
  data: T;
}
export class Queue<T> {
  private front: Item<T>;
  private back: Item<T>;

  constructor(first: T) {
    this.front = {
      next: undefined,
      data: first,
    }
    this.back = this.front;
  }

  pushBack(data: T) {
    this.back.next = {
      data,
      next: undefined,
    }
    this.back = this.back.next;
  }

  popFront() {
    if (this.front.next === undefined) throw new Error('Attempt to popFront on an queue of length 1');
    this.front = this.front.next;
  }

  first() {
    return this.front.data;
  }

  second() {
    return this.front.next?.data;
  }

  last() {
    return this.back.data;
  }

  *secondGenerator() {
    let item = this.front.next;
    while (item !== undefined) {
      yield item.data;
      item = item.next;
    }
  }
}
