import { GRID } from "~/consts";

export type Position = [number, number];

export const posRound = (pos: Position, scale = GRID): Position => [
  Math.round(pos[0] / scale) * scale,
  Math.round(pos[1] / scale) * scale,
];

export const posAdd = (lhs: Position, rhs: Position): Position => [lhs[0] + rhs[0], lhs[1] + rhs[1]];
export const posSub = (lhs: Position, rhs: Position): Position => [lhs[0] - rhs[0], lhs[1] - rhs[1]];
export const posMul = (lhs: Position, rhs: number): Position => [lhs[0] * rhs, lhs[1] * rhs];
export const posDiv = (lhs: Position, rhs: number): Position => [lhs[0] / rhs, lhs[1] / rhs];
export const posEq = (lhs: Position, rhs: Position): boolean => lhs[0] === rhs[0] && lhs[1] === rhs[1];
export const posMid = (lhs: Position, rhs: Position): Position => [(lhs[0] + rhs[0]) / 2, (lhs[1] + rhs[1]) / 2];
export const posFlip = (input: Position): Position => [-input[0], input[1]];
export const posRotX = (input: Position, center = input[0]): Position => [2 * center - input[0], input[1]];
