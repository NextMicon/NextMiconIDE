import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { Project } from "~/files";
import { Position, posAdd, posEq } from "~/utils";
import {
  InstanceKey,
  IoportKey,
  WaypointKey,
  getInstanceKey,
  getIoportKey,
  getWireKey,
  instanceKeyEq,
  ioportKeyEq,
  wireKeyEq,
} from "~/web/1_type";
import { projectState } from "../2_project/0_project";
import { useRevert } from "../2_project/2_revert";
import { selectIsEmpty, selectedObjectsState } from "./0_select";

const moveInstance = (project: Project, key: InstanceKey, delta: Position): Project => ({
  ...project,
  instances: project.instances.map((instance) =>
    instanceKeyEq(getInstanceKey(instance), key) ? { ...instance, pos: posAdd(instance.pos, delta) } : instance,
  ),
});

const moveIoport = (project: Project, key: IoportKey, delta: Position): Project => ({
  ...project,
  ioports: project.ioports.map((ioport) =>
    ioportKeyEq(getIoportKey(ioport), key) ? { ...ioport, pos: posAdd(ioport.pos, delta) } : ioport,
  ),
});

const moveWaypoint = (project: Project, key: WaypointKey, delta: Position): Project => ({
  ...project,
  wires: project.wires.map((wire) =>
    wireKeyEq(getWireKey(wire), key.wire)
      ? { ...wire, waypoints: wire.waypoints.map((p, i) => (i === key.index ? posAdd(p, delta) : p)) }
      : wire,
  ),
});

export const useMove = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  const selectedObjects = useRecoilValue(selectedObjectsState);
  const resetSelect = useResetRecoilState(selectedObjectsState);
  return (delta: Position) => {
    if (!posEq(delta, [0, 0]) && !selectIsEmpty(selectedObjects)) {
      console.log("Move", selectedObjects, delta);
      let ret = project;
      ret = selectedObjects.instances.reduce((acc, key) => moveInstance(acc, key, delta), ret);
      ret = selectedObjects.ioports.reduce((acc, key) => moveIoport(acc, key, delta), ret);
      ret = selectedObjects.waypoints.reduce((acc, key) => moveWaypoint(acc, key, delta), ret);
      setProject(ret);
      resetSelect();
      commit();
    }
  };
};
