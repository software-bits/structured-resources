export type PickByType<T, Type> = Pick<
  T,
  { [Key in keyof T]: T[Key] extends Type ? Key : never }[keyof T]
>;
