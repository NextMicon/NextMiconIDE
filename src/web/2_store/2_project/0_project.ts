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
