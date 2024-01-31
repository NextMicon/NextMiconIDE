import { selector } from "recoil";
import { BOARD_DIR, PACK_DIR, PROJ_DIR } from "~/consts";

export const pathState = selector({
  key: "path",
  get: async () => {
    const home = await window.ipc.dir.getHome();
    const homeExists = await window.ipc.fs.mkdir(home);

    const pack = [...home, PACK_DIR];
    const board = [...home, BOARD_DIR];
    const proj = [...home, PROJ_DIR];

    const exists = await Promise.all([window.ipc.fs.mkdir(pack), window.ipc.fs.mkdir(board), window.ipc.fs.mkdir(proj)]);

    const ready = homeExists && exists.reduce((acc, cur) => acc && cur, true);

    return { home, pack, board, proj };
  },
});
