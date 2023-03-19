/* eslint-disable max-classes-per-file */
import { ResourcePicker } from "../../services/resource-picker";

describe("resource-picker", () => {
  const baseMethod = jest.fn();
  class TesterBase {
    baseMethod = baseMethod;
  }
  const method = jest.fn();
  class Tester extends TesterBase {
    method = method;
  }
  const resourcePicker = new ResourcePicker({
    tester: new Tester(),
  });
  it("gets methods from both own and parents class", () => {
    const picked = resourcePicker.pickResources("tester");
    expect(Object.keys(picked)).toEqual(
      expect.arrayContaining(["baseMethod", "method"])
    );
  });
  it("can call method", () => {
    const picked = resourcePicker.pickResources("tester");
    picked.method("argument-1", "argument-2");
    expect(method).toHaveBeenCalledTimes(1);
    expect(method).toHaveBeenCalledWith("argument-1", "argument-2");
  });
  it("can call method from parent class", () => {
    const picked = resourcePicker.pickResources("tester");
    picked.baseMethod("argument-1", "argument-2");
    expect(baseMethod).toHaveBeenCalledTimes(1);
    expect(baseMethod).toHaveBeenCalledWith("argument-1", "argument-2");
  });
});
