import { atom } from "recoil";
import { Board, Project } from "~/files";

interface ProjectAll {
  path: string;
  name: string;
  proj: Project;
  boardPath: string[];
  board: Board;
}
export const projectAllState = atom<ProjectAll>({ key: "projectAll" });

export const projectPathState = atom<string[]>({ key: "projectPath" });
export const projectNameState = atom<string>({ key: "projectName" });
export const projectState = atom<Project>({ key: "project" });
export const boardPathState = atom<string[]>({ key: "boardPath" });
export const boardState = atom<Board>({ key: "board" });

// export const projectNameState = selector<string>({
//   key: "projectName",
//   get: ({ get }) => {
//     const projectPath = get(projectPathState);
//     return projectPath.split("/").at(-1) as string;
//   },
// });

// export const projectState = selector<Project>({
//   key: "project",
//   get: async ({ get }) => {
//     const projectPath = get(projectPathState);
//     console.log("Loadding projectState", projectPath);
//     const proj = await window.ipc.fs.read([projectPath, PROJ_FILE]).then((str) => load(str) as Project);
//     console.log("Loadded", proj);
//     return proj;
//   },
//   set: ({ get }, proj) => {
//     const projectPath = get(projectPathState);
//     window.ipc.fs
//       .write([projectPath, PROJ_FILE], dump(proj, { indent: 2 }))
//       .then(() => console.log(`Project Saved: ${projectPath}`))
//       .catch((e) => console.error(e));
//   },
// });

// export const boardPathState = selector<string[]>({
//   key: "boardPath",
//   get: ({ get }) => {
//     const appHome = get(appHomeDirState);
//     const project = get(projectState);
//     return [appHome, BOARD_DIR, project.board.name, project.board.version];
//   },
// });

// export const boardState = selector<Board>({
//   key: "board",
//   get: async ({ get }) => {
//     const boardPath = get(boardPathState);
//     const board = await window.ipc.fs.read([...boardPath, BOARD_FILE]).then((str) => load(str) as Board);
//     return board;
//   },
// });
