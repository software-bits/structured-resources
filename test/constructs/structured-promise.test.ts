import { StructuredPromise } from "../../constructs/structured-promise";

const delayedResponse = <T extends unknown>(
  duration: number,
  response: T
): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, duration);
  });

describe("structured promise", () => {
  it("resolves", async () => {
    const foo = {
      structuredPromise: new StructuredPromise(delayedResponse(1000, true)),
    };
    const promises = Object.values(foo).map((structuredPromise) =>
      structuredPromise.resolvePromise());
    await Promise.all(promises);
    expect(foo.structuredPromise.getPromise()).toStrictEqual(true);
  });
});
