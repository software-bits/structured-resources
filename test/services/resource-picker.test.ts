/* eslint-disable max-classes-per-file */
import { ResourcePicker } from "../../services/resource-picker";
import { delayedResponse } from '../test-helpers/delayed-response';

describe("resource-picker", () => {
  const baseMethod = jest.fn();
  class TesterBase {
    baseMethod = baseMethod;
  }
  const method = jest.fn();
  class Tester extends TesterBase {
    method = method;
  
    promiseMethod = () => delayedResponse(100, true);
  }
  it("gets methods from both own and parents class", () => {
    const resourcePicker = new ResourcePicker({
      tester: new Tester(),
    });
    const picked = resourcePicker.pickResources("tester");
    expect(Object.keys(picked)).toEqual(
      expect.arrayContaining(["baseMethod", "method"])
    );
  });
  it("can call method", () => {
    const resourcePicker = new ResourcePicker({
      tester: new Tester(),
    });
    const picked = resourcePicker.pickResources("tester");
     picked.method("argument-1", "argument-2");
    expect(method).toHaveBeenCalledTimes(1);
    expect(method).toHaveBeenCalledWith("argument-1", "argument-2");
  });
  it("can call and promise method", async () => {
    const resourcePicker = new ResourcePicker({
      tester: new Tester(),
    });
    const picked = resourcePicker.pickResources("tester");
    const response = await picked.promiseMethod().promise();
    expect(response).toStrictEqual({ tester: true });
  });
  it("can call method from parent class", () => {
    const resourcePicker = new ResourcePicker({
      tester: new Tester(),
    });
    const picked = resourcePicker.pickResources("tester");
    picked.baseMethod("argument-1", "argument-2");
    expect(baseMethod).toHaveBeenCalledTimes(1);
    expect(baseMethod).toHaveBeenCalledWith("argument-1", "argument-2");
  });
});
