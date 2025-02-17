const sum = (x: number, y: number) => (): Promise<number> =>
  Promise.resolve(x + y);

export const is = sum(1, 2);
