import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Position } from "~/utils";
import { Rect, corrision, corrisionRectPoint, diagonalRect } from "~/web/0_common";
import {
  Instance,
  InstanceKey,
  Primitive,
  IoportKey,
  WaypointKey,
  Wire,
  WireKey,
  getWaypointKey,
  instanceKeyEq,
  ioportKeyEq,
  waypointKeyEq,
  wireKeyEq,
} from "~/web/1_type";
import { instancesResolvedState } from "../3_selector/1_instance";
import { ioportsResolvedState } from "../3_selector/2_ioport";
import { wiresResolvedState } from "../3_selector/4_wire";
import { hwEditorFSM, mousePositionState } from "../4_editor/0_fsm";

export interface SelectedObjects {
  instances: InstanceKey[];
  ioports: IoportKey[];
  wires: WireKey[];
  waypoints: WaypointKey[];
}

export const selectIsEmpty = (selectedObjects: SelectedObjects): boolean =>
  selectedObjects.instances.length === 0 &&
  selectedObjects.ioports.length === 0 &&
  selectedObjects.wires.length === 0 &&
  selectedObjects.waypoints.length === 0;

export const selectedObjectsState = atom<SelectedObjects>({
  key: "selectedObjects",
  default: { instances: [], ioports: [], wires: [], waypoints: [] },
});

// --------------------------------------------------------------------------------
// Select
// オブジェクトを選択する

const selectInstance = (key: InstanceKey): SelectedObjects => ({
  instances: [key],
  ioports: [],
  wires: [],
  waypoints: [],
});

const selectIoport = (key: IoportKey): SelectedObjects => ({
  instances: [],
  ioports: [key],
  wires: [],
  waypoints: [],
});

const selectWire = (key: WireKey): SelectedObjects => ({
  instances: [],
  ioports: [],
  wires: [key],
  waypoints: [],
});

const selectWaypoint = (key: WaypointKey): SelectedObjects => ({
  instances: [],
  ioports: [],
  wires: [],
  waypoints: [key],
});

export const useSelectInstance = () => {
  const setSelectedObjects = useSetRecoilState(selectedObjectsState);
  return (key: InstanceKey) => setSelectedObjects(selectInstance(key));
};

export const useSelectIoport = () => {
  const setSelectedObjects = useSetRecoilState(selectedObjectsState);
  return (key: IoportKey) => setSelectedObjects(selectIoport(key));
};

export const useSelectWire = () => {
  const setSelectedObjects = useSetRecoilState(selectedObjectsState);
  return (key: WireKey) => setSelectedObjects(selectWire(key));
};

export const useSelectWaypoint = () => {
  const setSelectedObjects = useSetRecoilState(selectedObjectsState);
  return (key: WaypointKey) => setSelectedObjects(selectWaypoint(key));
};

// --------------------------------------------------------------------------------
// RangeSelect
// 範囲選択で選択されたオブジェクトを列挙する

const instanceRangeSelect = (instances: Instance[], rect: Rect): InstanceKey[] => {
  return instances
    .filter((instance) =>
      corrision({ x: instance.pos[0], y: instance.pos[1], width: instance.pack.size[0], height: instance.pack.size[1] }, rect),
    )
    .map(({ name }) => name);
};

const ioportRangeSelect = (ioports: Primitive[], rect: Rect): InstanceKey[] => {
  return ioports
    .filter((ioport) => corrision({ x: ioport.pos[0], y: ioport.pos[1], width: ioport.pack.size[0], height: ioport.pack.size[1] }, rect))
    .map(({ name }) => name);
};

const waypointRangeSelect = (wires: Wire[], rect: Rect): WaypointKey[] => {
  return wires.flatMap((wire) => {
    return wire.waypoints.flatMap((pos, i) => (corrisionRectPoint(pos, rect) ? [getWaypointKey(wire, i)] : []));
  });
};

export const useRangeSelect = () => {
  const instances = useRecoilValue(instancesResolvedState);
  const ioports = useRecoilValue(ioportsResolvedState);
  const wires = useRecoilValue(wiresResolvedState);
  const setSelectedObjects = useSetRecoilState(selectedObjectsState);
  return (start: Position, end: Position) => {
    const rect = diagonalRect(start[0], start[1], end[0], end[1]);
    setSelectedObjects({
      instances: instanceRangeSelect(instances, rect),
      ioports: ioportRangeSelect(ioports, rect),
      wires: [],
      waypoints: waypointRangeSelect(wires, rect),
    });
  };
};

// --------------------------------------------------------------------------------
// SelecctedObjectsResolved
// 範囲選択中の場合、現在選択されているオブジェクトを返すスイッチ
// これはfacadeの範疇かもしれない

export const selectedObjectsResolvedState = selector<SelectedObjects>({
  key: "selectedOblectsResolved",
  get: ({ get }) => {
    const fsm = get(hwEditorFSM);
    const instances = get(instancesResolvedState);
    const ioports = get(ioportsResolvedState);
    const wires = get(wiresResolvedState);
    const mouse = get(mousePositionState);
    const selectedObjects = get(selectedObjectsState);
    if (fsm.state === "Selecting") {
      const rect = diagonalRect(fsm.value.start[0], fsm.value.start[1], mouse[0], mouse[1]);
      return {
        instances: instanceRangeSelect(instances, rect),
        ioports: ioportRangeSelect(ioports, rect),
        wires: [],
        waypoints: waypointRangeSelect(wires, rect),
      };
    } else return selectedObjects;
  },
});

// --------------------------------------------------------------------------------
// AppendSelect
// 現在の選択に追加する

const appendInstance = (selected: SelectedObjects, add: InstanceKey): SelectedObjects => ({
  ...selected,
  instances: [...selected.instances, add],
});

const appendIoport = (selected: SelectedObjects, add: IoportKey): SelectedObjects => ({
  ...selected,
  ioports: [...selected.ioports, add],
});

const appendWire = (selected: SelectedObjects, add: WireKey): SelectedObjects => ({
  ...selected,
  wires: [...selected.wires, add],
});

const appendWaypoint = (selected: SelectedObjects, add: WaypointKey): SelectedObjects => ({
  ...selected,
  waypoints: [...selected.waypoints, add],
});

export const useAppendInstance = () => {
  const [selectedObjects, setSelectedObjects] = useRecoilState(selectedObjectsState);
  return (add: InstanceKey) => setSelectedObjects(appendInstance(selectedObjects, add));
};

export const useAppendIoport = () => {
  const [selectedObjects, setSelectedObjects] = useRecoilState(selectedObjectsState);
  return (add: IoportKey) => setSelectedObjects(appendIoport(selectedObjects, add));
};

export const useAppendWire = () => {
  const [selectedObjects, setSelectedObjects] = useRecoilState(selectedObjectsState);
  return (add: WireKey) => setSelectedObjects(appendWire(selectedObjects, add));
};

export const useAppendWaypoint = () => {
  const [selectedObjects, setSelectedObjects] = useRecoilState(selectedObjectsState);
  return (add: WaypointKey) => setSelectedObjects(appendWaypoint(selectedObjects, add));
};

// --------------------------------------------------------------------------------
// IsSelected
// オブジェクトが選択されているか判定する

export const instanceIsSelected = (selectedInstances: InstanceKey[], find: InstanceKey) =>
  selectedInstances.find((inst) => instanceKeyEq(inst, find)) !== undefined;

export const ioportIsSelected = (selectedIoports: IoportKey[], find: IoportKey) =>
  selectedIoports.find((ioport) => ioportKeyEq(ioport, find)) !== undefined;

export const wireIsSelected = (selectedWires: WireKey[], find: WireKey) =>
  selectedWires.find((wire) => wireKeyEq(wire, find)) !== undefined;

export const waypointIsSelected = (selectedWaypoints: WaypointKey[], find: WaypointKey) =>
  selectedWaypoints.find((waypoint) => waypointKeyEq(waypoint, find)) !== undefined;

export const useIoportIsSelected = (find: IoportKey) => {
  const selectedObjects = useRecoilValue(selectedObjectsResolvedState);
  return ioportIsSelected(selectedObjects.ioports, find);
};

export const useInstanceIsSelected = (find: InstanceKey) => {
  const selectedObjects = useRecoilValue(selectedObjectsResolvedState);
  return instanceIsSelected(selectedObjects.instances, find);
};

export const useWireIsSelected = (find: WireKey) => {
  const selectedObjects = useRecoilValue(selectedObjectsResolvedState);
  return wireIsSelected(selectedObjects.wires, find);
};

export const useWaypointIsSelected = (find: WaypointKey) => {
  const selectedObjects = useRecoilValue(selectedObjectsResolvedState);
  return waypointIsSelected(selectedObjects.waypoints, find);
};
