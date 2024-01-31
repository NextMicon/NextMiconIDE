import { ipcMain } from "electron";
import { Options, execa } from "execa";
import { getLogger } from "log4js";
import { join } from "path";
import { IPCKeys } from "~/ipckey";

const log = getLogger("IPC");

export const runHandler = () => {
  ipcMain.handle(IPCKeys.RUN_EXECA, async (_, command: string, args: string[], cwd: string[], options: Options) => {
    log.trace(IPCKeys.RUN_EXECA, command, args, cwd, options);
    const proc = execa(command, args, { cwd: join(...cwd), ...options });
    const result = await proc;
    return result;
  });
};
