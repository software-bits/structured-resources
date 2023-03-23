import { ResolvedPromise } from "../types/resolved-promise";
import { Resource } from "../types/resource";
import { PromiseManager } from "./promise-manager";
import { ResourceMethodResponse } from "../constructs/resource-method-response";
import { InheritedStructuredResourceAttributes } from "../types/inherited-structured-resource-attributes";

export class ResourcePicker<
  T extends Record<string, Resource>,
  ReturnType extends Promise<unknown>
> {
  private readonly promiseManager: PromiseManager<ReturnType>;

  constructor(private readonly allResources: T) {
    this.promiseManager = new PromiseManager();
  }

  private toBeReturnedFromFunction(): {
    data: Record<string, ReturnType | ReturnType[]>;
    promise: () => Promise<{
      [k: string]: ResolvedPromise<ReturnType> | ResolvedPromise<ReturnType>[];
    }>;
  } {
    return new ResourceMethodResponse({
      data: this.promiseManager.getPromises(),
      promise: async () => {
        const resolvedPromises = await this.promiseManager.resolvePromises();
        return resolvedPromises;
      },
    });
  }

  private toBeReturnedFromNonFunction<
    Key extends keyof T,
    ResourceAttributes extends keyof T[Key]
  >(resourceNames: Key[], attributeName: ResourceAttributes) {
    return Object.fromEntries(
      resourceNames.map((resource) => [
        resource,
        this.allResources[resource]?.[attributeName],
      ])
    );
  }

  private isResourceAttributeFunction<
    Key extends keyof T,
    ResourceAttributes extends keyof T[Key]
  >(resourceNames: Key[], attributeName: ResourceAttributes): boolean {
    return resourceNames.every(
      (resource) =>
        typeof this.allResources[resource][attributeName] === "function"
    );
  }

  private pickResourceAttributes<
    Key extends keyof T,
    ResourceAttributes extends keyof T[Key]
  >(resourceNames: Key[], attributeName: ResourceAttributes) {
    return this.isResourceAttributeFunction(resourceNames, attributeName)
      ? (...args: unknown[]) => {
          resourceNames.forEach((resource) =>
            this.promiseManager.addPromise(
              resource as string,
              (
                this.allResources[resource][
                  attributeName
                ] as unknown as Function
              )(...args)
            ));
          return this.toBeReturnedFromFunction();
        }
      : this.toBeReturnedFromNonFunction(resourceNames, attributeName);
  }

  /**
   * Get all attributes from a resource.
   * Deep searches for own property names and returns array of attribute names.
   */
  private getAllInheritedAttributes(
    singleResource: Resource
  ): (keyof Resource)[] {
    type Attribute = keyof typeof singleResource;
    const getAttributes = (object: Object): Attribute[] => {
      const properties = Object.getOwnPropertyNames(object) as Attribute[];
      const ownPrototype = Object.getPrototypeOf(object);
      return !ownPrototype
        ? properties
        : [...properties, ...getAttributes(ownPrototype)];
    };
    const deduplicate = (array: Attribute[]): Attribute[] => [
      ...new Set(array),
    ];
    return deduplicate(getAttributes(singleResource));
  }

  public pickResources<Keys extends [keyof T, ...(keyof T)[]]>(...resources: Keys): InheritedStructuredResourceAttributes<T, Keys[number]> {
    const firstResourceName = resources[0];
    const firstResource = this.allResources[firstResourceName];
    const resourceAttributes = this.getAllInheritedAttributes(firstResource);
    return Object.fromEntries(resourceAttributes.map((attributeName) => [attributeName, this.pickResourceAttributes(resources, attributeName)])) as InheritedStructuredResourceAttributes<T, Keys[number]>
  }
}
