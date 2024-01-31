export const range = (n: number) => [...Array(n).keys()];

export function zip<T1, T2>(lhs: T1[], rhs: T2[]): [T1, T2][] {
  return range(Math.min(lhs.length, rhs.length)).map((i) => [lhs[i], rhs[i]]);
}
