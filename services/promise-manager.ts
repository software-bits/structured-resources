import { ResolvedPromise } from "../types/resolved-promise";
import { mapObjectValues } from "../utils/map-object-values";
import { StructuredPromise } from "../constructs/structured-promise";

export class PromiseManager<PromiseType extends Promise<unknown>> {
  private promises: Record<
    string,
    StructuredPromise<PromiseType> | StructuredPromise<PromiseType>[]
  >;

  constructor() {
    this.promises = {};
  }

  private isPromiseArray(
    input: unknown
  ): input is StructuredPromise<PromiseType>[] {
    return (
      Array.isArray(input) &&
      input.every((element) => element instanceof StructuredPromise)
    );
  }

  public addPromise(key: string, promise: PromiseType) {
    const keyElement = this.promises[key];
    if (keyElement !== undefined) {
      if (this.isPromiseArray(keyElement)) {
        this.promises[key] = [...keyElement, new StructuredPromise(promise)];
      } else {
        this.promises[key] = [keyElement, new StructuredPromise(promise)];
      }
    } else {
      this.promises[key] = new StructuredPromise(promise);
    }
  }

  private formatPromises(
    promises: Record<
      string,
      StructuredPromise<PromiseType>[] | StructuredPromise<PromiseType>
    >
  ) {
    return mapObjectValues(promises, (value) => {
      if (this.isPromiseArray(value)) {
        return value.map((promise) => promise.getPromise());
      }
      return value.getPromise();
    });
  }

  public getPromises(): Record<string, PromiseType[] | PromiseType> {
    return this.formatPromises(this.promises);
  }

  public async resolvePromises(): Promise<
    Record<
      string,
      ResolvedPromise<PromiseType>[] | ResolvedPromise<PromiseType>
    >
  > {
    const promises = Object.values(this.promises).flatMap((structuredPromises) =>
      this.isPromiseArray(structuredPromises)
        ? structuredPromises.map((promise) => promise.resolvePromise())
        : structuredPromises.resolvePromise());
    await Promise.all(promises);
    return this.formatPromises(this.promises) as Record<
      string,
      ResolvedPromise<PromiseType>[] | ResolvedPromise<PromiseType>
    >;
  }
}
