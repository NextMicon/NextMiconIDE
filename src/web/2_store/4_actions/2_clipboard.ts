import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Project } from "~/files";
import { Position, posAdd, posMid, posRound, posSub } from "~/utils";
import {
  InstanceKey,
  IoportKey,
  PortKey,
  WireKey,
  getInstanceKey,
  getIoportKey,
  getWireKey,
  instanceKeyEq,
  ioportKeyEq,
  wireKeyEq,
} from "~/web/1_type";
import { boardState, projectState } from "../2_project/0_project";
import { useRevert } from "../2_project/2_revert";
import { mousePositionState } from "../4_editor/0_fsm";
import { selectIsEmpty, selectedObjectsResolvedState } from "./0_select";
import { TODO_getNewIoportName, createInstance, createWire, getNewInstanceName } from "./1_create";

interface Clipboard {
  instances: Project["instances"];
  ioports: Project["ioports"];
  wires: Project["wires"];
}

const clipboardEmpty = (clipboard: Clipboard) =>
  clipboard.instances.length === 0 && clipboard.ioports.length === 0 && clipboard.wires.length === 0;

const clipboardState = atom<Clipboard>({ key: "hwClipboard", default: { instances: [], ioports: [], wires: [] } });

const getClipboardRange = (clipboard: Clipboard) => {
  return { min: [0, 0] as Position, max: [500, 500] as Position };
};

// --------------------------------------------------------------------------------
// Copy

const copyInstance = (clipboard: Clipboard, key: InstanceKey, project: Project): Clipboard => {
  const found = project.instances.find((inst) => instanceKeyEq(getInstanceKey(inst), key));
  return found ? { ...clipboard, instances: [...clipboard.instances, found] } : clipboard;
};

const copyIoport = (clipboard: Clipboard, key: IoportKey, project: Project): Clipboard => {
  const found = project.ioports.find((ioport) => ioportKeyEq(getIoportKey(ioport), key));
  return found ? { ...clipboard, ioports: [...clipboard.ioports, found] } : clipboard;
};

const copyWire = (clipboard: Clipboard, key: WireKey, project: Project): Clipboard => {
  const found = project.wires.find((wire) => wireKeyEq(getWireKey(wire), key));
  return found ? { ...clipboard, wires: [...clipboard.wires, found] } : clipboard;
};

export const useCopy = () => {
  const setHwClipboard = useSetRecoilState(clipboardState);
  const project = useRecoilValue(projectState);
  const selectedObjects = useRecoilValue(selectedObjectsResolvedState);
  return () => {
    if (!selectIsEmpty(selectedObjects)) {
      console.log("Copy", selectedObjects);
      let ret: Clipboard = { instances: [], ioports: [], wires: [] };
      ret = selectedObjects.instances.reduce((acc, key) => copyInstance(acc, key, project), ret);
      ret = selectedObjects.ioports.reduce((acc, key) => copyIoport(acc, key, project), ret);
      ret = selectedObjects.wires.reduce((acc, key) => copyWire(acc, key, project), ret);
      setHwClipboard(ret);
    }
  };
};

// --------------------------------------------------------------------------------
// Paste

const pasteInstance = (project: Project, instance: Project["instances"][number], delta: Position): Project => {
  return createInstance(project, {
    ...instance,
    name: getNewInstanceName(project, instance.name),
    pos: posAdd(instance.pos, delta),
  });
};

const pasteIoport = (project: Project, ioport: Project["ioports"][number]): Project => {
  console.log("TODO: Paste Ioport", ioport);
  return project;
};

const pasteWire = (project: Project, wire: Project["wires"][number]): Project => {
  console.log("TODO: Paste Wire", wire);
  return project;
};

export const usePaste = () => {
  const { commit } = useRevert();
  const clipboard = useRecoilValue(clipboardState);
  const mousePosition = useRecoilValue(mousePositionState);
  const [project, setProject] = useRecoilState(projectState);
  const board = useRecoilValue(boardState);
  return () => {
    if (!clipboardEmpty(clipboard)) {
      console.log("Paste", clipboard, mousePosition);

      // Calculate Delta
      const range = getClipboardRange(clipboard);
      const mid = posMid(range.max, range.min);
      const delta = posRound(posSub(mousePosition, mid));

      // Generate new objects
      const newInstances = clipboard.instances.map((instance) => ({
        ...instance,
        name: getNewInstanceName(project, instance.name),
        pos: posAdd(instance.pos, delta),
        oldName: instance.name,
      }));
      const newIoports = clipboard.ioports.map((ioport) => ({
        ...ioport,
        name: TODO_getNewIoportName(project, board, ioport.type),
        pos: posAdd(ioport.pos, delta),
        oldName: ioport.name,
      }));
      const newWires = clipboard.wires.flatMap((wire) => {
        const fromInstance = newInstances.find(({ oldName }) => oldName === wire.first[0]);
        const fromIoport = newIoports.find(({ oldName }) => oldName === wire.first[0]);
        const toInstance = newInstances.find(({ oldName }) => oldName === wire.last[0]);
        const toIoport = newIoports.find(({ oldName }) => oldName === wire.last[0]);
        const newFrom = fromInstance?.name ?? fromIoport?.name;
        const newTo = toInstance?.name ?? toIoport?.name;
        if (newFrom && newTo) {
          return [
            {
              ...wire,
              from: [newFrom, wire.first[1]] as PortKey,
              to: [newTo, wire.last[1]] as PortKey,
              waypoints: wire.waypoints.map((pos) => posAdd(pos, delta)),
            },
          ];
        } else return [];
      });

      // Clone Objects
      let ret = project;
      ret = newInstances.reduce((acc, inst) => createInstance(acc, inst), ret);
      // ret = newIoports.reduce((acc, key) => createIoport(acc, key), ret);
      ret = newWires.reduce((acc, key) => createWire(acc, key), ret);
      setProject(ret);

      // TODO : Select new objects

      commit();
    }
  };
};
