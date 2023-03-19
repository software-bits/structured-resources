# Structured-resources

A structured way to define resources. Built to bring structure into stacks with many resources, like in `aws-cdk` or a smart home setup.

`Structured-resources` is a small (dependency free) tool that helps to structure your resources. It provides an additional layer to your resources so you can easily call methods for multiple constructs at once, surrounded with intelligent typing.

It is designed to help create a clear stack definition, so that you can easily see what resources are used in your stack, and how they interact with each-other.

## Installation

```
npm install structured-resources
```

## Usage

It provides five methods to access your constructs;

- `for`: selects one or more resources and returns a new object with inherited methods and attributes from the resources.
- `all`: selects all resources and returns a new object with inherited methods and attributes from the resources.
- `select`: select single resource
- `selectSome`: select one or more resources and returns an array of the selected resources
- `selectAll`: returns an array of all resources

```typescript
class Bar {
  public testA = () => 123;
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

structuredResources.for("fooOne", "fooTwo").testA().data; // returns { fooOne: 123, fooTwo: 123 }, both fooOne and fooTwo have method testA
structuredResources.for("fooTwo").testC().data; // returns { fooTwo: 789 }
structuredResources.for("fooOne", "fooTwo").testB(); // Type ERROR: Property 'testB' does not exist on type, fooTwo does not have method testB
structuredResources.all().testA().data; // returns { fooOne: 123, fooTwo: 123 }
structuredResources.select("fooOne"); // returns FooOne instance
```

See [/examples](https://github.com/software-bits/structured-resources/tree/main/examples) for an example with `aws-cdk`.

## Advanced examples

### Chaining methods

On `for` and `all` methods a new function `chain` is returned. This will make the resource methods chainable.

Example:

```typescript
class Foo {
  public methodA = () => 123;
  public methodB = () => 456;
}
const structuredResources = new StructuredResources({
  foo: new Foo(),
});
structuredResources.all().chain().methodA().methodB().methodA(); // calls methodA twice anc methodB once
structuredResources.all().chain().methodA().methodB().methodA().data; // calls methodA twice anc methodB once and returns { foo: [123, 456, 123] }
```

### Asynchronous functions

By calling `promise()` at the end of a resolution chain, all called methods will be promised.

Example:

```typescript
class LightBulb {
  private on: boolean;

  private brightness: number;

  constructor(public readonly name: string) {
    this.on = false;
    this.brightness = 50;
  }

  async toggle(): Promise<boolean> {
    this.on = !this.on;
    return someAsyncActionThatReturns(this.on);
  }

  async setBrightness(brightness: number): Promise<number> {
    this.brightness = brightness;
    return someAsyncActionThatReturns(this.brightness);
  }
}

const livingRoomLights = new StructuredResources({
  lampCouch: new LightBulb("lamp-couch"),
  ceilingLampOne: new LightBulb("ceiling-lamp-a"),
  ceilingLampTwo: new LightBulb("ceiling-lamp-b"),
});

await livingRoomLights.all().setBrightness(30).promise(); // calls and awaits setBrightness() for every light and returns { lampCouch: 30, ceilingLampOne: 30, ceilingLampTwo: 30 }
await livingRoomLights.all().chain().setBrightness(30).toggle().promise(); // calls and awaits setBrightness() and toggle() for every light and returns { lampCouch: [30, true], ceilingLampOne: [30, true], ceilingLampTwo: [30, true] }
```

## Testing

Tests can be ran using the following command:

```
npm run test
```

## Contributing

Pull requests are welcome. Please make sure to update tests as appropriate.

## License

[MIT](https://opensource.org/licenses/MIT)
