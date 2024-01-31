import { ipcMain, shell } from "electron";
import { writeFileSync } from "fs";
import { getLogger } from "log4js";
import { join } from "path";
import { IPCKeys } from "~/ipckey";

const log = getLogger("IPC");

export const webHandler = () => {
  // Open Website in default browser
  ipcMain.handle(IPCKeys.WEB_OPEN, (_, url: string) => {
    log.trace(IPCKeys.WEB_OPEN, url);
    shell.openExternal(url);
  });

  // Fetch File from Web
  ipcMain.handle(IPCKeys.WEB_FETCH, async (_, url: string): Promise<string> => {
    log.trace(IPCKeys.WEB_FETCH, url);
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(1000) });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      const str = await res.text();
      return str;
    } catch (e) {
      log.error(e);
      throw e;
    }
  });

  // Fetch File and Write Local
  ipcMain.handle(IPCKeys.WEB_CLONE, async (_, remotePaths: string[], localPaths: string[]) => {
    log.trace(IPCKeys.WEB_FETCH, join(...remotePaths), join(...localPaths));
    return fetch(join(...remotePaths))
      .then((res) => res.text())
      .then((str) => writeFileSync(join(...localPaths), str));
  });
};
