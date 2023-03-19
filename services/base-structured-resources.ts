import { Resource } from "../types/resource";
import { ResourcePicker } from "./resource-picker";
import { CustomMethods } from "../types/custom-methods";
import { ChainMaker } from "./chain-maker";
import { NonEmptyObject } from '../types/non-empty-object';

export class BaseStructuredResources<T extends Record<string, Resource>> {
  constructor(protected readonly resources: NonEmptyObject<T>) {}

  private addCustomMethods<U extends Record<string, unknown>>(
    input: U
  ): U & CustomMethods<U> {
    return {
      ...input,
      chain: () => ChainMaker.makeChainable(input),
    };
  }

  /**
   * Pick resources and return new object with same attributes as the selected resource.
   */
  protected pickResources<Keys extends [keyof T, ...(keyof T)[]]>(...resources: Keys) {
    const pickedResources = new ResourcePicker(this.resources).pickResources(
      ...resources
    );
    return this.addCustomMethods(pickedResources);
  }
}
