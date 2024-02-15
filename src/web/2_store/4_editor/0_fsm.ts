import { atom } from "recoil";
import { Position } from "~/utils";
import { PackKey, PortKey, WireKey } from "~/web/1_type";

export const mousePositionState = atom<Position>({ key: "mousePosition", default: [0, 0] });

type States =
  | { state: "Default"; value: {} }
  | { state: "Selecting"; value: { start: Position } }
  | { state: "Moving"; value: { start: Position } }
  | { state: "AddPrim"; value: { type: string; name: string } }
  | { state: "AddInst"; value: { mod: PackKey; name: string } }
  | { state: "AddWaypoint"; value: { wire: WireKey; idx: number } }
  | { state: "Wireing"; value: { start: PortKey; startPos: Position; path: Position[] } };

export const hwEditorFSM = atom<States>({ key: "hwEditorState", default: { state: "Default", value: {} } });
