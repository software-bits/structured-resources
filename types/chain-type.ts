import { PickByType } from "./pick-by-type";
import { ReplaceReturnType } from "./replace-return-type";
import { ResolvedPromise } from "./resolved-promise";

type PickMethods<T> = PickByType<T, (...a: any) => any>;

type ObjectValuesAsArray<
  T extends { [Key: string]: unknown } | undefined
> = {
  [Key in keyof T]: [T[Key]];
};

type MergeReturnTypes<
  T extends { [Key: string]: unknown[] },
  W extends { [Key: string]: unknown }
> = {
  [Key in keyof T & keyof W]: [...T[Key], W[Key]];
};

export type ReplaceEveryReturnType<
  T extends object,
  ResolvedValue extends
    | { [Key: string]: unknown[] }
    | undefined,
  PromisedValue extends
    | { [Key: string]: unknown[] }
    | undefined
> = {
  [Key in keyof T]: T[Key] extends (...a: any) => any
    ? ReplaceReturnType<
        T[Key],
        ReplaceEveryReturnType<
          T,
          ResolvedValue extends { [Key: string]: unknown[] }
            ? MergeReturnTypes<
                ResolvedValue,
                ResolvedPromise<ReturnType<ReturnType<T[Key]>["promise"]>>
              >
            : ObjectValuesAsArray<
                ResolvedPromise<ReturnType<ReturnType<T[Key]>["promise"]>>
              >,
          PromisedValue extends { [Key: string]: unknown[] }
            ? MergeReturnTypes<PromisedValue, ReturnType<T[Key]>["data"]>
            : ObjectValuesAsArray<ReturnType<T[Key]>["data"]>
        >
      >
    : never;
} & {
  promise: () => Promise<ResolvedValue>;
  data: PromisedValue;
};

export type ChainType<T extends Record<string, unknown>> =
  ReplaceEveryReturnType<PickMethods<T>, undefined, undefined>;
