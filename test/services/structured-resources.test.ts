/* eslint-disable max-classes-per-file */
import { StructuredResources } from "../../index";
import { expectType } from "../test-helpers/expect-type";

describe("structured resources", () => {
  it("inherits methods from class", () => {
    class Bar {
      public testA = () => 123;
    }
    class Foo extends Bar {
      public testB = () => 456;
    }
    const structuredResources = new StructuredResources({
      foo: new Foo(),
    });

    expect(structuredResources.select("foo").testA()).toStrictEqual(123);
    expectType<number>(structuredResources.select("foo").testA());
    expect(structuredResources.select("foo").testB()).toStrictEqual(456);
    expectType<number>(structuredResources.select("foo").testB());

    expect(structuredResources.for("foo").testA().data).toStrictEqual({
      foo: 123,
    });
    expectType<{ foo: number }>(structuredResources.for("foo").testA().data);
    expect(structuredResources.for("foo").testB().data).toStrictEqual({
      foo: 456,
    });
    expectType<{ foo: number }>(structuredResources.for("foo").testB().data);

    expect(structuredResources.all().testA().data).toStrictEqual({ foo: 123 });
    expectType<{ foo: number }>(structuredResources.all().testA().data);
    expect(structuredResources.all().testB().data).toStrictEqual({ foo: 456 });
    expectType<{ foo: number }>(structuredResources.all().testB().data);

    expect(
      structuredResources.selectSome("foo").map((fn) => fn.testA())
    ).toStrictEqual([123]);
    expect(
      structuredResources.selectSome("foo").map((fn) => fn.testB())
    ).toStrictEqual([456]);

    expect(
      structuredResources.selectAll().map((fn) => fn.testA())
    ).toStrictEqual([123]);
    expect(
      structuredResources.selectAll().map((fn) => fn.testB())
    ).toStrictEqual([456]);
  });
  it("inherits methods from right class", () => {
    class Bar {
      public testA = () => 123;

      public constA = 999;
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

    expect(structuredResources.select("fooOne").testA()).toStrictEqual(123);
    expect(structuredResources.select("fooOne").testB()).toStrictEqual(456);
    expect(structuredResources.select("fooTwo").testA()).toStrictEqual(123);
    expect(structuredResources.select("fooTwo").testC()).toStrictEqual(789);

    expect(
      structuredResources.for("fooOne", "fooTwo").testA().data
    ).toStrictEqual({ fooOne: 123, fooTwo: 123 });
    expectType<{ fooOne: number; fooTwo: number }>(
      structuredResources.for("fooOne", "fooTwo").testA().data
    );
    expect(structuredResources.for("fooOne").testB().data).toStrictEqual({
      fooOne: 456,
    });
    expectType<{ fooOne: number }>(
      structuredResources.for("fooOne").testB().data
    );
    expect(structuredResources.for("fooTwo").testC().data).toStrictEqual({
      fooTwo: 789,
    });
    expectType<{ fooTwo: number }>(
      structuredResources.for("fooTwo").testC().data
    );

    expect(structuredResources.all().testA().data).toStrictEqual({
      fooOne: 123,
      fooTwo: 123,
    });
    expectType<{ fooOne: number; fooTwo: number }>(
      structuredResources.all().testA().data
    );

    expect(
      structuredResources.selectSome("fooOne", "fooTwo").map((fn) => fn.testA())
    ).toStrictEqual([123, 123]);
    expect(
      structuredResources.selectSome("fooOne").map((fn) => fn.testB())
    ).toStrictEqual([456]);
    expect(
      structuredResources.selectSome("fooTwo").map((fn) => fn.testC())
    ).toStrictEqual([789]);

    expect(
      structuredResources.selectAll().map((fn) => fn.testA())
    ).toStrictEqual([123, 123]);
  });
  it('is chainable when using "for" method', () => {
    class Foo {
      public methodA(argA: unknown, argB: unknown) {
        void argA;
        void argB;
      }

      public methodB() {}
    }
    jest.spyOn(Foo.prototype, "methodA");
    jest.spyOn(Foo.prototype, "methodB");
    const structuredResources = new StructuredResources({
      foo: new Foo(),
    });
    structuredResources
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
  it('is chainable when using "all" method', () => {
    class Foo {
      public methodA(argA: unknown, argB: unknown) {
        void argA;
        void argB;
      }

      public methodB() {}
    }
    class Bar {
      public methodA(argA: unknown, argB: unknown) {
        void argA;
        void argB;
      }

      public methodB() {}
    }
    jest.spyOn(Foo.prototype, "methodA");
    jest.spyOn(Foo.prototype, "methodB");
    jest.spyOn(Bar.prototype, "methodA");
    jest.spyOn(Bar.prototype, "methodB");
    const structuredResources = new StructuredResources({
      foo: new Foo(),
      bar: new Bar(),
    });
    structuredResources
      .all()
      .chain()
      .methodA("a", "b")
      .methodB()
      .methodA("c", "d");
    expect(Foo.prototype.methodA).toHaveBeenCalledTimes(2);
    expect(Foo.prototype.methodA).toHaveBeenNthCalledWith(1, "a", "b");
    expect(Foo.prototype.methodA).toHaveBeenNthCalledWith(2, "c", "d");
    expect(Foo.prototype.methodB).toHaveBeenCalledTimes(1);
    expect(Bar.prototype.methodA).toHaveBeenCalledTimes(2);
    expect(Bar.prototype.methodA).toHaveBeenNthCalledWith(1, "a", "b");
    expect(Bar.prototype.methodA).toHaveBeenNthCalledWith(2, "c", "d");
    expect(Bar.prototype.methodB).toHaveBeenCalledTimes(1);
  });
});
