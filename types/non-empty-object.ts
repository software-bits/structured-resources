export type NonEmptyObject<T> = T extends Record<string, never> ? never : T;
