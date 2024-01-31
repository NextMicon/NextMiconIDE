import { dump } from "js-yaml";
import { selector, useRecoilValue } from "recoil";
import { BOARD_DIR, MK_FILE, PROJ_DIR, PROJ_FILE, SW_DIR, SW_FILE, SW_INIT } from "~/consts";
import { Project } from "~/files";
import { pathState } from "../0_sys/directory";

export const projectListState = selector({
  key: "projectList",
  get: async ({ get }) => {
    const { home } = get(pathState);
    // TODO: 最後に開いた順にする
    // TODO: PROJ_DIR 以外の場所にあるプロジェクトも含める
    const projList = await window.ipc.fs.subdir([...home, PROJ_DIR]);
    return projList.map((name) => ({ name, path: [...home, PROJ_DIR, name] }));
  },
});

export const useCreateProject = () => {
  const { home } = useRecoilValue(pathState);
  return async (name: string, board: { owner: string; name: string; version: string }) => {
    // Create Micon
    await window.ipc.fs.mkdir([...home, PROJ_DIR, name]);
    const init: Project = {
      board,
      instances: [],
      ioports: [],
      wires: [],
    };
    await window.ipc.fs.write([...home, PROJ_DIR, name, PROJ_FILE], dump(init));
    // Create Software
    await window.ipc.fs.mkdir([...home, PROJ_DIR, name, SW_DIR]);
    await window.ipc.fs.write([...home, PROJ_DIR, name, SW_DIR, SW_FILE], SW_INIT);
    // Copy Makefile
    const mkfile_tmplt = await window.ipc.fs.read([...home, BOARD_DIR, board.owner, board.name, board.version, MK_FILE]);
    const mkfile = mkfile_tmplt.replaceAll("${PROJ_NAME}", name);
    await window.ipc.fs.write([...home, PROJ_DIR, name, MK_FILE], mkfile);
  };
};
