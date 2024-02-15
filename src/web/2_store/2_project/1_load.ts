import { dump, load } from "js-yaml";
import { useRecoilValue, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState } from "recoil";
import { BOARD_DIR, BOARD_FILE, PROJ_FILE } from "~/consts";
import { Board, Project } from "~/files";
import { useMessage } from "../0_sys/message";
import { localPacksState } from "../1_library/1_packs";
import { useResetHweditorState } from "../4_view/editor";
import { boardPathState, boardState, projectNameState, projectPathState, projectState } from "./0_project";
import { revertBufferState } from "./2_revert";

export const useOpenProject = () => {
  useRecoilValueLoadable(localPacksState); // prefetch
  const { createMessage } = useMessage();

  const resetRevertBuffer = useResetRecoilState(revertBufferState);
  const resetSvg = useResetHweditorState();

  const setProjectPath = useSetRecoilState(projectPathState);
  const setProjectName = useSetRecoilState(projectNameState);
  const setProject = useSetRecoilState(projectState);
  const setBoardPath = useSetRecoilState(boardPathState);
  const setBoard = useSetRecoilState(boardState);

  return async (path: string[]) => {
    window.log.info("openProject: Start");
    try {
      resetRevertBuffer();
      resetSvg();
      const appHome = await window.ipc.dir.getHome();
      // ----------------------------------------------------------------------
      window.log.info("openProject: Load Project");
      const proj = await window.ipc.fs.read([...path, PROJ_FILE]).then((str) => load(str) as Project);
      // ----------------------------------------------------------------------
      window.log.info("openProject: Load Board");
      const boardPath = [...appHome, BOARD_DIR, proj.board.owner, proj.board.name, proj.board.version];
      const board = await window.ipc.fs.read([...boardPath, BOARD_FILE]).then((str) => load(str) as Board);
      // ----------------------------------------------------------------------
      setProjectPath(path);
      setProjectName(path.at(-1) as string);
      setProject(proj);
      setBoardPath(boardPath);
      setBoard(board);
      window.log.info("openProject: Done");
    } catch (e) {
      window.log.error("openProject: Failed");
      window.log.error(e);
      createMessage("error", "Failed to open project", `${e}`);
    }
  };
};

export const useSaveProject = () => {
  const projectPath = useRecoilValue(projectPathState);
  const project = useRecoilValue(projectState);
  return () => {
    const selected: Project = {
      board: project.board,
      instances: project.instances.map(({ name, pack, params, pos, addr, flip }) => ({
        name,
        pack: { owner: pack.owner, name: pack.name, version: pack.version },
        params,
        pos,
        addr,
        flip,
      })),
      ioports: project.ioports.map(({ name, type, params, pos, assign, flip }) => ({ name, type, params, pos, assign, flip })),
      wires: project.wires.map(({ first, last, waypoints, width }) => ({ first, last, waypoints, width })),
    };
    const str = dump(selected, { indent: 2, noRefs: true, flowLevel: 2 });
    window.ipc.fs
      .write([...projectPath, PROJ_FILE], str)
      .then(() => console.log(`Project Saved: ${projectPath.join("/")}`))
      .catch((e) => console.error(e));
  };
};
