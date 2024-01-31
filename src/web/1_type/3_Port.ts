import { Position } from "~/utils";

export interface Port {
  key: string;
  object: string;
  name: string;
  direct: "input" | "output" | "inout";
  width: number;
  pos: Position;
}

export type PortKey = [string, string];

export const portKeyStr = (port: PortKey) => `${port[0]}/${port[1]}`;
export const eqPortKey = (lhs: PortKey, rhs: PortKey) => lhs[0] === rhs[0] && lhs[1] === rhs[1];
export const wireName = (port: PortKey) => `${port[0]}_${port[1]}`;
