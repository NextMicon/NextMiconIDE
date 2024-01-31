import { ipcMain } from "electron";
import { getLogger } from "log4js";
import { IPCKeys } from "~/ipckey";

const log = getLogger("IPC");

export const githubHandler = () => {
  ipcMain.handle(
    IPCKeys.GITHUB_FETCH,
    async (_, owner: string, repo: string, branch: string, path: string[]): Promise<string> => {
      const url = `https://raw.github.com/${owner}/${repo}/${branch}/${path.join("/")}`;
      log.trace(IPCKeys.GITHUB_FETCH, url);
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(1000) });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        const str = await res.text();
        return str;
      } catch (e) {
        log.error(e);
        throw e;
      }
    },
  );
};
