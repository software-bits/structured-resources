import { StructuredPromise } from "../../constructs/structured-promise";
import { delayedResponse } from '../test-helpers/delayed-response';

describe("structured promise", () => {
  it("resolves", async () => {
    const foo = {
      structuredPromise: new StructuredPromise(delayedResponse(100, true)),
    };
    const promises = Object.values(foo).map((structuredPromise) =>
      structuredPromise.resolvePromise());
    await Promise.all(promises);
    expect(foo.structuredPromise.getPromise()).toStrictEqual(true);
  });
});
