import { CustomMethods } from "../types/custom-methods";
import { InheritedStructuredResourceAttributes } from "../types/inherited-structured-resource-attributes";
import { Resource } from "../types/resource";
import { BaseStructuredResources } from "./base-structured-resources";

export class StructuredResources<
  T extends Record<string, Resource>
> extends BaseStructuredResources<T> {
  /**
   * Pick some resources from list.
   * Returns new object with same attributes as the selected resources.
   */
  for<Keys extends [keyof T, ...(keyof T)[]]>(...resources: Keys): InheritedStructuredResourceAttributes<T, Keys[number]> &
    CustomMethods<InheritedStructuredResourceAttributes<T, Keys[number]>> {
    return this.pickResources(...resources) as T[keyof T];
  }

  /**
   * Pick all resources from list.
   * Returns new object with same attributes as the selected resources.
   */
  all<Key extends keyof T>(): InheritedStructuredResourceAttributes<T, Key> &
    CustomMethods<InheritedStructuredResourceAttributes<T, Key>> {
    return this.for(...(Object.keys(this.resources) as [Key, ...Key[]]));
  }

  /**
   * Select a single resource from list.
   */
  select<Key extends keyof T>(resource: Key): T[Key] {
    return this.resources[resource];
  }

  /**
   * Select multiple resources from list.
   * Returns array of selected resources.
   */
  selectSome<Keys extends [keyof T, ...(keyof T)[]]>(...resources: Keys): T[Keys[number]][] {
    return resources.map((resource) => this.resources[resource]);
  }

  /**
   * Select all resources from list.
   * Returns array of resources.
   */
  selectAll(): T[keyof T][] {
    return Object.values(this.resources) as T[keyof T][];
  }
}
