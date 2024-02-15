import { Board, Project } from "~/files";
import { Position } from "~/utils";

export interface Primitive {
  name: string;
  pack: Board["ioifs"][number];
  params: [string, string | number][];
  pos: Position;
  flip?: boolean;
}

export type IoportKey = string;
export const getIoportKey = (ioport: Primitive | Project["ioports"][number]) => ioport.name;
export const ioportKeyEq = (lhs: IoportKey, rhs: IoportKey) => lhs === rhs;
