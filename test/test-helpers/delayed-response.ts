export const delayedResponse = <T extends unknown>(
  duration: number,
  response: T
): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, duration);
  });