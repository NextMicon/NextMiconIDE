import { Project } from "~/files";
import { Position } from "~/utils";
import { PortKey, portKeyStr } from "~/web/1_type";

export interface Wire {
  first: PortKey;
  last: PortKey;
  firstPos: Position;
  lastPos: Position;
  waypoints: Position[];
  width: number;
}

export type WireKey = PortKey;

export const getWireKey = (wire: Wire | Project["wires"][number]): WireKey => wire.last;
export const getWireKeyStr = (wire: { last: PortKey }) => portKeyStr(wire.last);
export const wireKeyEq = (lhs: WireKey, rhs: WireKey) => lhs[0] === rhs[0] && lhs[1] === rhs[1];

export interface WaypointKey {
  wire: WireKey;
  index: number;
}

export const getWaypointKey = (wire: Wire | Project["wires"][number], idx: number) => ({
  wire: getWireKey(wire),
  index: idx,
});
export const waypointKeyEq = (lhs: WaypointKey, rhs: WaypointKey) => lhs.wire === rhs.wire && lhs.index === rhs.index;
