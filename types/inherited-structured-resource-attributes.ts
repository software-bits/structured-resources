import { ReplaceReturnType } from "./replace-return-type";
import { ResolvedPromise } from "./resolved-promise";

type StructuredAttributeReturnType<
  T extends Record<string, Record<string, unknown>>,
  Keys extends keyof T,
  Property extends keyof T[Keys],
  AttributeValue
> = AttributeValue extends (...a: any) => any
  ? ReplaceReturnType<
      AttributeValue,
      {
        data: { [Key in Keys]: ReturnType<AttributeValue> };
        promise: () => Promise<{
          [Key in Keys]: ResolvedPromise<ReturnType<AttributeValue>>;
        }>;
      }
    >
  : { [Key in Keys]: T[Key][Property] };

export type InheritedStructuredResourceAttributes<
  T extends Record<string, Record<string, unknown>>,
  Key extends keyof T
> = Omit<
  {
    [Property in keyof T[Key]]: StructuredAttributeReturnType<
      T,
      Key,
      Property,
      T[Key][Property]
    >;
  },
  "chain"
>;
