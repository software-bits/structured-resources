export type ReplaceReturnType<T extends (...a: any) => any, NewReturnType> = (
  ...a: Parameters<T>
) => NewReturnType;
