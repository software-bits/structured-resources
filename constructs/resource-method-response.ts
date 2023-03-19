export class ResourceMethodResponse<
  Data extends unknown,
  PromiseFn extends () => Promise<unknown>
> {
  public readonly data: Data;

  public readonly promise: PromiseFn;

  constructor({ data, promise }: { data: Data; promise: PromiseFn }) {
    this.data = data;
    this.promise = promise;
  }
}
