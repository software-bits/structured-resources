import { ChainMaker } from "../../services/chain-maker";

describe("chain-maker", () => {
  it("makes chainable", () => {
    const testerA = jest.fn();
    const testerB = jest.fn();
    const testObject = {
      testerA,
      testerB,
    };
    const chainableTester = ChainMaker.makeChainable(testObject);
    chainableTester.testerA().testerB().testerA();
    expect(testerA).toHaveBeenCalledTimes(2);
    expect(testerB).toHaveBeenCalledTimes(1);
  });
  it("calls chained methods with the right arguments", () => {
    const testerA = jest.fn();
    const testerB = jest.fn();
    const testObject = {
      testerA,
      testerB,
    };
    const chainableTester = ChainMaker.makeChainable(testObject);
    chainableTester.testerA(1).testerB("a", "b", "c").testerA("d", "e", "f");
    expect(testerA).toHaveBeenCalledTimes(2);
    expect(testerA).toHaveBeenNthCalledWith(1, 1);
    expect(testerA).toHaveBeenNthCalledWith(2, "d", "e", "f");
    expect(testerB).toHaveBeenCalledTimes(1);
    expect(testerB).toHaveBeenLastCalledWith("a", "b", "c");
  });
});
