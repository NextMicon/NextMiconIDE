import { Position } from "~/utils";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Line {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export const diagonalRect = (x1: number, y1: number, x2: number, y2: number): Rect => ({
  x: (x1 + x2) / 2,
  y: (y1 + y2) / 2,
  width: Math.abs(x1 - x2),
  height: Math.abs(y1 - y2),
});

export const corrision = (rect1: Rect, rect2: Rect) =>
  Math.abs(rect1.x - rect2.x) < rect1.width / 2 + rect2.width / 2 &&
  Math.abs(rect1.y - rect2.y) < rect1.height / 2 + rect2.height / 2;

export const corrisionLineRect = (rect: Rect, line: Line) => {
  return false;
};

export const corrisionRectPoint = (point: Position, rect: Rect) => {
  return (
    rect.x - rect.width / 2 <= point[0] &&
    point[0] <= rect.x + rect.width / 2 &&
    rect.y - rect.height / 2 <= point[1] &&
    point[1] <= rect.y + rect.height / 2
  );
};
