import { MouseEventHandler } from "react";
import { useRecoilState } from "recoil";
import { Position, posMid, zip } from "~/utils";
import { Wire, getWireKey } from "~/web/1_type";
import { hwEditorFSM, useAppendWire, useCreateWaypoint, useSelectWire, useWireIsSelected } from "~/web/2_store";

export const useWire = (wire: Wire) => {
  // Global State
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const selectWire = useSelectWire();
  const appendWire = useAppendWire();
  const createWaypooint = useCreateWaypoint();

  // Calculate
  const key = getWireKey(wire);
  const selected = useWireIsSelected(key);
  const select = () => selectWire(key);
  const append = () => appendWire(key);

  const pathPoints = [wire.firstPos, ...wire.waypoints, wire.lastPos];

  const midPoints = zip([wire.firstPos, ...wire.waypoints], [...wire.waypoints, wire.lastPos]).map(([lhs, rhs]) =>
    posMid(lhs, rhs),
  );
  const startAddWaypoint = (idx: number) => {
    setState({ state: "AddWaypoint", value: { wire: key, idx } });
  };

  const insertWaypoint = (idx: number, pos: Position) => createWaypooint(key, idx, pos);
  const onClick: MouseEventHandler = () => {
    select();
  };
  const onDoubleClick: MouseEventHandler = () => {
    console.log("Add Waypoint");
  };

  // Export
  return {
    key,
    selected,
    pathPoints,
    midPoints,
    startAddWaypoint,
    select,
    append,
    insertWaypoint,
    onClick,
    onDoubleClick,
  };
};
