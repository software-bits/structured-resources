export class StructuredPromise<PromiseType extends unknown> {
  constructor(private promise: PromiseType) {}

  getPromise() {
    return this.promise;
  }

  async resolvePromise() {
    this.promise = await this.promise;
    return this.promise;
  }
}
