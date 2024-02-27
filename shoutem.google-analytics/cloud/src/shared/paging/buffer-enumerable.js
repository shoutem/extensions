import _ from 'lodash';

export class BufferEnumerable {
  constructor(method, methodLoader, ...args) {
    this.method = method;
    this.methodLoader = methodLoader;
    this.args = args;

    this.buffer = [];
    this.limit = 20;
    this.currentIndex = -1;
    this.reachedEnd = false;

    this.next = this.next.bind(this);
  }

  async next() {
    this.currentIndex++;

    if (this.currentIndex < this.buffer.length) {
      return this.buffer[this.currentIndex];
    }

    if (!this.reachedEnd) {
      const page = { limit: this.limit, offset: this.buffer.length };
      const result = await this.methodLoader(this.method, page, ...this.args);
      const items = _.get(result, '_pageItems', result);

      if (items && items.length > 0) {
        this.buffer.push(...items);
      }

      if (items && items.length !== this.limit) {
        this.reachedEnd = true;
      }

      return this.buffer[this.currentIndex];
    }

    return null;
  }
}
