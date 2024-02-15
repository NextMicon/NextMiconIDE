import { ipcMain } from "electron";
import { Options, execa } from "execa";
import { getLogger } from "log4js";
import { join } from "path";
import { IPCKeys } from "~/ipckey";

const log = getLogger("IPC");

export const runHandler = () => {
  ipcMain.handle(IPCKeys.RUN_EXECA, async (_, command: string, args: string[], cwd: string[], options: Options) => {
    log.trace(IPCKeys.RUN_EXECA, command, args, cwd, options);
    const result = await execa(command, args, { cwd: join(...cwd), ...options })
      .then((r) => {
        return {
          exitCode: r.exitCode,
          stdout: r.stdout,
          stderr: r.stderr,
        };
      })
      .catch((e) => {
        return {
          exitCode: e.exitCode,
          stderr: e.stderr,
          stdout: e.stdout,
        };
      });
    return result;
  });
};
