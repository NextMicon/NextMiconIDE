import { selector } from "recoil";
import { posAdd, posRound, posSub } from "~/utils";
import { Wire, eqPortKey, getWaypointKey, getWireKey, wireKeyEq } from "~/web/1_type";
import { projectState } from "../2_project/0_project";
import { selectedObjectsState, waypointIsSelected } from "../4_actions/0_select";
import { hwEditorFSM, mousePositionState } from "../4_editor/0_fsm";
import { portsState } from "./3_port";

export const wiresResolvedState = selector<Wire[]>({
  key: "wiresResolved",
  get: ({ get }) => {
    const ports = get(portsState);
    const fsm = get(hwEditorFSM);
    const { wires } = get(projectState);
    const mousePosition = get(mousePositionState);
    const selectedObjects = get(selectedObjectsState);

    return wires.flatMap((wire) => {
      const firstPos = ports.find((port) => eqPortKey(wire.first, [port.object, port.name]))?.pos;
      if (firstPos === undefined) {
        console.error("Cannot resolve port", wire.first);
        return [];
      }
      const lastPos = ports.find((port) => eqPortKey(wire.last, [port.object, port.name]))?.pos;
      if (lastPos === undefined) {
        console.error("Cannot resolve port:", wire.last);
        return [];
      }

      let waypoints = wire.waypoints;

      // Resolve waypoint if moving
      if (fsm.state === "Moving") {
        const delta = posRound(posSub(mousePosition, fsm.value.start));
        waypoints = wire.waypoints.map((pos, idx) => {
          if (waypointIsSelected(selectedObjects.waypoints, getWaypointKey(wire, idx))) {
            return posAdd(pos, delta);
          } else return pos;
        });
      }

      // Resolve waypoint if adding
      if (fsm.state === "AddWaypoint") {
        if (wireKeyEq(getWireKey(wire), fsm.value.wire)) {
          waypoints = [
            ...wire.waypoints.slice(0, fsm.value.idx),
            posRound(mousePosition),
            ...wire.waypoints.slice(fsm.value.idx),
          ];
        }
      }

      return [{ ...wire, firstPos, lastPos, waypoints }];
    });
  },
});
