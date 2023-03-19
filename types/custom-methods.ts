import { ChainType } from "./chain-type";

export type CustomMethods<U extends Record<string, unknown>> = {
  chain: () => ChainType<U>;
};
