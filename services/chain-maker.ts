import { ChainType } from "../types/chain-type";
import { mapObjectValues } from "../utils/map-object-values";

export class ChainMaker {
  static makeChainable<T extends Record<string, unknown>>(
    input: T
  ): ChainType<T> {
    const chainObject = mapObjectValues(input, (value) => typeof value === "function"
        ? (...args: unknown[]) => ({
              ...chainObject,
              ...value(...args),
            })
        : input);
    return chainObject as unknown as ChainType<T>;
  }
}
