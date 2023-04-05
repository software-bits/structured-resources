/* eslint-disable max-classes-per-file */
import { StructuredResources } from "../../index";
import { delayedResponse } from '../test-helpers/delayed-response';
import { expectType } from "../test-helpers/expect-type";

describe("structured resources", () => {
  class Bar {
    public testA = () => 123;

    public asyncFn = async () => delayedResponse(100, true);
  }
  class FooOne extends Bar {
    public testB = () => 456;
  }
  class FooTwo extends Bar {
    public testC = () => 789;
  }
  const structuredResources = new StructuredResources({
    fooOne: new FooOne(),
    fooTwo: new FooTwo(),
  });
  it("selects instance from structured resource", () => {
    expect(structuredResources.select("fooOne")).toBeInstanceOf(FooOne);
  });
  it("selects multiple resources", () => {
    const [testA, testB] = structuredResources.selectSome("fooOne", "fooTwo");
    expect(testA).toBeInstanceOf(FooOne);
    expect(testB).toBeInstanceOf(FooTwo);
  });
  it("selects all resources", () => {
    const [testA, testB] = structuredResources.selectAll();
    expect(testA).toBeInstanceOf(FooOne);
    expect(testB).toBeInstanceOf(FooTwo);
  });
  it("makes method of single resource callable by 'for'", () => {
    const response = structuredResources.for('fooOne').testA();
    expectType<{ fooOne: number }>(response.data);
    expect(response.data).toStrictEqual({ fooOne: 123 });
  });
  it("makes method of single resource callable by 'for' and does not hold historic responses", () => {
    const responseA = structuredResources.for('fooOne').testA();
    const responseB = structuredResources.for('fooOne').testA();
    expect(responseA.data).toStrictEqual({ fooOne: 123 });
    expect(responseB.data).toStrictEqual({ fooOne: 123 });
  });
  it("makes method of single resource callable by 'for' and provides chain functionality", () => {
    const response = structuredResources.for('fooOne').chain().testA().testA().testB();
    expect(response.data).toStrictEqual({ fooOne: [123, 123, 456] });
    expectType<{ fooOne: number[] }>(response.data);
  });
  it("makes method of single resource callable by 'for' and provides chain functionality and does not hold historic responses", () => {
    const responseA = structuredResources.for('fooOne').chain().testA().testA().testB();
    const responseB = structuredResources.for('fooOne').chain().testA().testA().testB();
    expect(responseA.data).toStrictEqual({ fooOne: [123, 123, 456] });
    expect(responseB.data).toStrictEqual({ fooOne: [123, 123, 456] });
  });
  it("makes method of multiple resources callable by 'for'", () => {
    const response = structuredResources.for('fooOne', 'fooTwo').testA();
    expectType<{ fooOne: number }>(response.data);
    expect(response.data).toStrictEqual({ fooOne: 123, fooTwo: 123 });
  });
  it("makes method of multiple resources callable by 'for' and does not hold historic responses", () => {
    const responseA = structuredResources.for('fooOne', 'fooTwo').testA();
    const responseB = structuredResources.for('fooOne', 'fooTwo').testA();
    expect(responseA.data).toStrictEqual({ fooOne: 123, fooTwo: 123 });
    expect(responseB.data).toStrictEqual({ fooOne: 123, fooTwo: 123 });
  });
  it("makes method of multiple resources callable by 'for' and provides chain functionality", () => {
    const response = structuredResources.for('fooOne', 'fooTwo').chain().testA().testA();
    expect(response.data).toStrictEqual({ fooOne: [123, 123], fooTwo: [123, 123] });
    expectType<{ fooOne: number[], fooTwo: number[] }>(response.data);
  });
  it("makes method of multiple resources callable by 'for' and provides chain functionality and does not hold historic responses", () => {
    const responseA = structuredResources.for('fooOne', 'fooTwo').chain().testA().testA();
    const responseB = structuredResources.for('fooOne', 'fooTwo').chain().testA().testA();
    expect(responseA.data).toStrictEqual({ fooOne: [123, 123], fooTwo: [123, 123] });
    expect(responseB.data).toStrictEqual({ fooOne: [123, 123], fooTwo: [123, 123] });
  });
  it("makes method of multiple resources callable by 'all'", () => {
    const response = structuredResources.all().testA();
    expectType<{ fooOne: number }>(response.data);
    expect(response.data).toStrictEqual({ fooOne: 123, fooTwo: 123 });
  });
  it("makes method of multiple resources callable by 'all' and does not hold historic responses", () => {
    const responseA = structuredResources.all().testA();
    const responseB = structuredResources.all().testA();
    expect(responseA.data).toStrictEqual({ fooOne: 123, fooTwo: 123 });
    expect(responseB.data).toStrictEqual({ fooOne: 123, fooTwo: 123 });
  });
  it("makes method of multiple resources callable by 'all' and provides chain functionality", () => {
    const response = structuredResources.all().chain().testA().testA();
    expect(response.data).toStrictEqual({ fooOne: [123, 123], fooTwo: [123, 123] });
    expectType<{ fooOne: number[], fooTwo: number[] }>(response.data);
  });
  it("makes method of multiple resources callable by 'all' and provides chain functionality and does not hold historic responses", () => {
    const responseA = structuredResources.all().chain().testA().testA();
    const responseB = structuredResources.all().chain().testA().testA();
    expect(responseA.data).toStrictEqual({ fooOne: [123, 123], fooTwo: [123, 123] });
    expect(responseB.data).toStrictEqual({ fooOne: [123, 123], fooTwo: [123, 123] });
  });
  it("can promise to call a method for multiple resources", async () => {
    const response = await structuredResources.all().asyncFn().promise();
    expect(response).toStrictEqual({ fooOne: true, fooTwo: true });
  });
  it("can promise to call a method for multiple resources while chained", async () => {
    const response = await structuredResources.all().chain().asyncFn().asyncFn().promise();
    expect(response).toStrictEqual({ fooOne: [true, true], fooTwo: [true, true] });
  });
  it('is chainable when using "for" method and each function is called with the right attributes', () => {
    class Foo {
      public methodA(argA: unknown, argB: unknown) {
        void argA;
        void argB;
      }

      public methodB() {}
    }
    jest.spyOn(Foo.prototype, "methodA");
    jest.spyOn(Foo.prototype, "methodB");
    const alternativeStructuredResources = new StructuredResources({
      foo: new Foo(),
    });
    alternativeStructuredResources
      .for("foo")
      .chain()
      .methodA("a", "b")
      .methodB()
      .methodA("c", "d");
    expect(Foo.prototype.methodA).toHaveBeenCalledTimes(2);
    expect(Foo.prototype.methodA).toHaveBeenNthCalledWith(1, "a", "b");
    expect(Foo.prototype.methodA).toHaveBeenNthCalledWith(2, "c", "d");
    expect(Foo.prototype.methodB).toHaveBeenCalledTimes(1);
  });
  it('is chainable when using "all" method and each function is called with the right attributes', () => {
    class Foo {
      public methodA(argA: unknown, argB: unknown) {
        void argA;
        void argB;
      }

      public methodB() {}
    }
    class BarB {
      public methodA(argA: unknown, argB: unknown) {
        void argA;
        void argB;
      }

      public methodB() {}
    }
    jest.spyOn(Foo.prototype, "methodA");
    jest.spyOn(Foo.prototype, "methodB");
    jest.spyOn(BarB.prototype, "methodA");
    jest.spyOn(BarB.prototype, "methodB");
    const alternativeStructuredResources = new StructuredResources({
      foo: new Foo(),
      bar: new BarB(),
    });
    alternativeStructuredResources
      .all()
      .chain()
      .methodA("a", "b")
      .methodB()
      .methodA("c", "d");
    expect(Foo.prototype.methodA).toHaveBeenCalledTimes(2);
    expect(Foo.prototype.methodA).toHaveBeenNthCalledWith(1, "a", "b");
    expect(Foo.prototype.methodA).toHaveBeenNthCalledWith(2, "c", "d");
    expect(Foo.prototype.methodB).toHaveBeenCalledTimes(1);
    expect(BarB.prototype.methodA).toHaveBeenCalledTimes(2);
    expect(BarB.prototype.methodA).toHaveBeenNthCalledWith(1, "a", "b");
    expect(BarB.prototype.methodA).toHaveBeenNthCalledWith(2, "c", "d");
    expect(BarB.prototype.methodB).toHaveBeenCalledTimes(1);
  });
});
