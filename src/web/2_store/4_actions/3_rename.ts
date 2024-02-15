import { useRecoilState } from "recoil";
import { Project } from "~/files";
import { projectState } from "../2_project/0_project";
import { useRevert } from "../2_project/2_revert";

const renameInstance = (project: Project, oldName: string, newName: string): Project => {
  const duplicate = project.ioports.find((inst) => inst.name === newName);
  if (duplicate) {
    console.error(`Instance name duplicate: ${newName}`);
    return project;
  }
  return {
    ...project,
    // Rename instance
    instances: project.instances.map((inst) => (inst.name === oldName ? { ...inst, name: newName } : inst)),
    // Rename wire
    wires: project.wires.map((wire) => ({
      ...wire,
      first: wire.first[0] === oldName ? [newName, wire.first[1]] : wire.first,
      last: wire.last[0] === oldName ? [newName, wire.last[1]] : wire.last,
    })),
  };
};

export const useRenameInstance = () => {
  const [project, setProject] = useRecoilState(projectState);
  const { commit } = useRevert();
  return (oldName: string, newName: string) => {
    console.log("Rename", oldName, newName);
    setProject(renameInstance(project, oldName, newName));
    commit();
  };
};

const renameIoport = (project: Project, oldName: string, newName: string): Project => {
  // TODO: Check port name
  return {
    ...project,
    // Rename ioport
    ioports: project.ioports.map((ioport) => (ioport.name === oldName ? { ...ioport, name: newName } : ioport)),
    // Rename wire
    wires: project.wires.map((wire) => ({
      ...wire,
      first: wire.first[0] === oldName ? [newName, wire.first[1]] : wire.first,
      last: wire.last[0] === oldName ? [newName, wire.last[1]] : wire.last,
    })),
  };
};

export const useRenameIoport = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  return (oldName: string, newName: string) => {
    console.log("Rename", oldName, newName);
    setProject(renameIoport(project, oldName, newName));
    commit();
  };
};
