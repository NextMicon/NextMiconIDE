import { Project } from "~/files";
import { Position } from "~/utils";
import { Pack } from "~/web/1_type";

export interface Instance {
  name: string;
  pack: Pack;
  params: [string, string | number][];
  pos: Position;
  flip?: boolean;
  addr?: number;
}

export type InstanceKey = string;
export const getInstanceKey = (instance: Instance | Project["instances"][number]) => instance.name;
export const instanceKeyEq = (lhs: InstanceKey, rhs: InstanceKey) => lhs === rhs;
