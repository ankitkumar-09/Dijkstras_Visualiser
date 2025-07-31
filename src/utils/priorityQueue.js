export default class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(nodeId, distance) {
    this.heap.push({ nodeId, distance });
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.sinkDown(0);
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  decreasePriority(nodeId, newDistance) {
    const index = this.heap.findIndex((item) => item.nodeId === nodeId);
    if (index !== -1 && newDistance < this.heap[index].distance) {
      this.heap[index].distance = newDistance;
      this.bubbleUp(index);
    }
  }

  has(nodeId) {
    return this.heap.some((item) => item.nodeId === nodeId);
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].distance < this.heap[parentIndex].distance) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else break;
    }
  }

  sinkDown(index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let smallest = index;
    if (left < this.heap.length && this.heap[left].distance < this.heap[smallest].distance)
      {
         smallest = left;
      }
    if (right < this.heap.length && this.heap[right].distance < this.heap[smallest].distance)
      {
      smallest = right;
      }
    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      this.sinkDown(smallest);
    }
  }

  getNodes() {
    return this.heap.map((item) => item.nodeId).sort((a, b) => a - b);
  }
}