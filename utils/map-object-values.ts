export const mapObjectValues = <
  Key extends string,
  Obj extends Record<Key, unknown>,
  Output extends unknown
>(
  object: Obj,
  mapFn: (value: Obj[Key], key: Key) => Output
): Record<Key, Output> =>
  Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      key,
      mapFn(value as Obj[Key], key as Key),
    ])
  ) as Record<Key, Output>;
