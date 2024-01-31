import { atom, useRecoilState } from "recoil";
import { Project } from "~/files";
import { projectState } from "./0_project";

interface RevertBuffer {
  undo: Project[];
  redo: Project[];
}

export const revertBufferState = atom<RevertBuffer>({
  key: "revertBuffer",
  default: { undo: [], redo: [] },
});

export const useRevert = () => {
  const [buffer, setBuffer] = useRecoilState(revertBufferState);
  const [project, setProject] = useRecoilState(projectState);
  return {
    undo: () => {
      if (buffer.undo.length === 0) return;
      console.log("Undo:", buffer);
      const [last, ...rest] = buffer.undo;
      setBuffer({ undo: rest, redo: [project, ...buffer.redo] });
      setProject(last);
    },
    redo: () => {
      if (buffer.redo.length === 0) return;
      console.log("Redo:", buffer);
      const [next, ...rest] = buffer.redo;
      setBuffer({ undo: [project, ...buffer.undo], redo: rest });
      setProject(next);
    },
    commit: () => {
      setBuffer({ undo: [project, ...buffer.undo], redo: [] });
      console.log("Commit:", [project, ...buffer.undo]);
    },
  };
};
