export type ResolvedPromise<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : T;
