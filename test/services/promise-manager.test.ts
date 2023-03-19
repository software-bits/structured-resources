import { PromiseManager } from "../../services/promise-manager";

describe("promise-manager", () => {
  it("adds and gets promises", () => {
    const promiseManager = new PromiseManager();
    expect(promiseManager.getPromises()).toStrictEqual({});
    const promise = new Promise((resolve) => { resolve("resolved") });
    promiseManager.addPromise("identifier", promise);
    expect(promiseManager.getPromises()).toStrictEqual({
      identifier: promise,
    });
  });
  it("resolves promises", async () => {
    const promiseManager = new PromiseManager();
    const resolved = "resolved-1";
    const promise = new Promise((resolve) => { resolve(resolved) });
    promiseManager.addPromise("identifier", promise);
    expect(await promiseManager.resolvePromises()).toStrictEqual({
      identifier: resolved,
    });
  });
  it("adds multiple promises with same identifier", () => {
    const promiseManager = new PromiseManager();
    const promiseOne = new Promise((resolve) => { resolve("resolvedOne") });
    const promiseTwo = new Promise((resolve) => { resolve("resolvedTwo") });
    const promiseThree = new Promise((resolve) => { resolve("resolvedThree") });
    promiseManager.addPromise("identifier", promiseOne);
    promiseManager.addPromise("identifier", promiseTwo);
    promiseManager.addPromise("identifier", promiseThree);
    expect(promiseManager.getPromises()).toStrictEqual({
      identifier: [promiseOne, promiseTwo, promiseThree],
    });
  });
  it("resolves promises with same identifier", async () => {
    const promiseManager = new PromiseManager();
    const resolvedOne = "resolved-1";
    const resolvedTwo = "resolved-2";
    const resolvedThree = "resolved-3";
    const promiseOne = new Promise((resolve) => { resolve(resolvedOne) });
    const promiseTwo = new Promise((resolve) => { resolve(resolvedTwo) });
    const promiseThree = new Promise((resolve) => { resolve(resolvedThree) });
    promiseManager.addPromise("identifier", promiseOne);
    promiseManager.addPromise("identifier", promiseTwo);
    promiseManager.addPromise("identifier", promiseThree);
    expect(await promiseManager.resolvePromises()).toStrictEqual({
      identifier: [resolvedOne, resolvedTwo, resolvedThree],
    });
  });
});
