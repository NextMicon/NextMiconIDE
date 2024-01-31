import { useRecoilState, useRecoilValue } from "recoil";
import { Board, Project } from "~/files";
import { Position } from "~/utils";
import { InstanceKey, Port, Wire, WireKey, getInstanceKey, getWireKey, instanceKeyEq, wireKeyEq } from "~/web/1_type";
import { boardState, projectState } from "../2_project/0_project";
import { useRevert } from "../2_project/2_revert";
import { portsState } from "../3_selector/3_port";
import { useSelectInstance } from "./0_select";

// --------------------------------------------------------------------------------
// Create Instance

export const instanceExists = (project: Project, key: InstanceKey) =>
  project.instances.find((inst) => instanceKeyEq(getInstanceKey(inst), key)) !== undefined;

export const getNewInstanceName = (project: Project, base: string) => {
  for (let i = 0; Number.isSafeInteger(i); ++i) {
    const name = `${base}${i}`;
    if (!instanceExists(project, name)) return name;
  }
  throw `ERROR: Too Many Instance: ${base}`;
};

export const useGetNewInstanceName = () => {
  const project = useRecoilValue(projectState);
  return (base: string) => getNewInstanceName(project, base);
};

export const createInstance = (project: Project, newInstance: Project["instances"][number]): Project => {
  if (instanceExists(project, newInstance.name)) throw `Instance name duplicate: ${newInstance.name}`;
  return { ...project, instances: [...project.instances, newInstance] };
};

export const useCreateInstance = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  const selectInstance = useSelectInstance();
  return (newInstance: Project["instances"][number]) => {
    setProject(createInstance(project, newInstance));
    commit();
    selectInstance(newInstance.name);
  };
};

// --------------------------------------------------------------------------------
// Create Ioport

const getAvailableIoports = (project: Project, board: Board, type: string) => {};

export const TODO_getNewIoportName = (project: Project, board: Board, type: string) => {
  return "";
};

export const useAvailableIoports = () => {
  const board = useRecoilValue(boardState);
  const { ioports } = useRecoilValue(projectState);
  const usedList = ioports.map(({ name }) => name);
  return (type: string) => {
    const list = Object.entries(board.ioports)
      .filter(([_, types]) => types.includes(type))
      .map(([name, _]) => name)
      .filter((name) => !usedList.includes(name));
    return list;
  };
};

export const useCreateIoport = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  const getAvailableIoports = useAvailableIoports();
  return (newIoport: { name?: string; type: string; params: [string, string | number][]; pos: [number, number] }) => {
    const getNewName = () => {
      getAvailableIoports(newIoport.type);
      throw `ERROR: Too Many IOPorts`;
    };
    const name = newIoport.name ?? getNewName();
    setProject({ ...project, ioports: [...project.ioports, { ...newIoport, name }] });
    commit();
  };
};

// --------------------------------------------------------------------------------
// CreateWire

export const createWire = (project: Project, newWire: Project["wires"][number]): Project => {
  return { ...project, wires: [...project.wires, newWire] };
};

const validateNewWire = (project: Project, newWire: Wire, ports: Port[]) => {
  // Find Port
  const fromPort = ports.find((port) => port.key === `${newWire.first[0]}/${newWire.first[1]}`);
  const toPort = ports.find((port) => port.key === `${newWire.last[0]}/${newWire.last[1]}`);
  if (fromPort === undefined) throw `Undefined port: ${newWire.first}`;
  if (toPort === undefined) throw `Undefined port: ${newWire.last}`;

  // Check Type of Connection
  if (fromPort.direct !== "output") throw `Invalid wire direction`;
  if (toPort.direct !== "input") throw `Invalid wire directon`;
  if (fromPort.width !== toPort.width) throw `Invalid wire width`;

  // Remove multiple drived port
  const alreadyDrived = project.wires.find((wire) => wire.last[0] === newWire.last[0] && wire.last[1] === newWire.last[1]);
  if (alreadyDrived !== undefined) throw `Port already connected: ${newWire.last}`;

  // Add wire
  return true;
};

export const useCreateWire = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  const ports = useRecoilValue(portsState);
  return (newWire: Wire) => {
    try {
      validateNewWire(project, newWire, ports);
      console.log(`Create wire: ${newWire.first} -> ${newWire.last}`);
      setProject(createWire(project, newWire));
      commit();
    } catch (e) {
      console.error(e);
    }
  };
};

// --------------------------------------------------------------------------------
// Create Waypoint

const createWaypoint = (project: Project, wireKey: WireKey, idx: number, pos: Position): Project => {
  return {
    ...project,
    wires: project.wires.map((wire) => {
      if (wireKeyEq(getWireKey(wire), wireKey)) {
        return { ...wire, waypoints: [...wire.waypoints.slice(0, idx), pos, ...wire.waypoints.slice(idx)] };
      } else return wire;
    }),
  };
};

export const useCreateWaypoint = () => {
  // Global State
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);

  // Local State
  return (wireKey: WireKey, idx: number, pos: Position) => {
    setProject(createWaypoint(project, wireKey, idx, pos));
    commit();
  };
};
