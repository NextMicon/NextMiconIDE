import { load } from "js-yaml";
import { selector, useRecoilValue } from "recoil";
import { BOARD_DIR, BOARD_FILE, URL_BOARD_REPO, URL_PACK_REPO } from "~/consts";
import { Board } from "~/files";
import { pathState } from "../0_sys/directory";
import { flatten } from "./util";

// --------------------------------------------------------------------------------
// ファイルを探索しボードの一覧を作る

export const boardListState = selector({
  key: "boardList",
  get: async ({ get }) => {
    const { home } = get(pathState);
    try {
      const tree = await window.ipc.fs.tree([...home, BOARD_DIR]);
      const boardList = flatten(tree).flatMap(({ path }) => {
        const [board_dir, owner, name, version, board_file] = path.split("/").slice(-5);
        const ok = board_dir === BOARD_DIR && board_file === BOARD_FILE;
        return ok ? [{ owner, name, version }] : [];
      });
      return boardList;
    } catch (e) {
      window.log.error(`Failed to search libraries in "${[home, BOARD_DIR]}"`);
      window.log.error(e);
      throw e;
    }
  },
});

export const boardsState = selector({
  key: "boards",
  get: async ({ get }) => {
    const { home } = get(pathState);
    const boardList = get(boardListState);
    const boards = await Promise.all(
      boardList.map(async ({ owner, name, version }) => {
        const boardFile = await window.ipc.fs
          .read([...home, BOARD_DIR, owner, name, version, BOARD_FILE])
          .then((str) => load(str) as Board);
        return { ...boardFile, owner, name, version };
      }),
    );
    console.log(boards);
    return boards;
  },
});

// --------------------------------------------------------------------------------
// ボードをダウンロード

export const useDownloadBoard = () => {
  const { home } = useRecoilValue(pathState);
  return async (owner: string, name: string, version: string) => {
    const path = [owner, name, version];
    const zip = `${name}.zip`;
    await window.ipc.fs.mkdir([...home, BOARD_DIR, ...path]);
    await window.ipc.web.clone([URL_BOARD_REPO, ...path, zip], [...home, BOARD_DIR, ...path, zip]);
    // TODO: Unzip
    // await window.ipc.fs.unzip([...home, BOARD_DIR, ...path, zip], [...home, BOARD_DIR, ...path]);
  };
};
