import { OpenDialogOptions, contextBridge, ipcRenderer } from "electron";
import { Options } from "execa";
import { ConfigJSON } from "~/main/config";
import { IPCKeys } from "../ipckey";

contextBridge.exposeInMainWorld("log", {
  fatal: (message: any, ...args: any[]) => ipcRenderer.invoke(IPCKeys.LOG_FATAL, message, ...args),
  error: (message: any, ...args: any[]) => ipcRenderer.invoke(IPCKeys.LOG_ERROR, message, ...args),
  warn: (message: any, ...args: any[]) => ipcRenderer.invoke(IPCKeys.LOG_WARN, message, ...args),
  info: (message: any, ...args: any[]) => ipcRenderer.invoke(IPCKeys.LOG_INFO, message, ...args),
  debug: (message: any, ...args: any[]) => ipcRenderer.invoke(IPCKeys.LOG_DEBUG, message, ...args),
  trace: (message: any, ...args: any[]) => ipcRenderer.invoke(IPCKeys.LOG_TRACE, message, ...args),
});

contextBridge.exposeInMainWorld("ipc", {
  clipboard: {
    copy: (str: string) => ipcRenderer.invoke(IPCKeys.SYS_COPY, str),
  },
  dir: {
    getHome: () => ipcRenderer.invoke(IPCKeys.SYS_HOME),
    getHidden: () => ipcRenderer.invoke(IPCKeys.SYS_HIDDEN),
  },
  fs: {
    browse: (opt: OpenDialogOptions) => ipcRenderer.invoke(IPCKeys.FS_BROWSE, opt),
    read: (paths: string[]) => ipcRenderer.invoke(IPCKeys.FS_READ, paths),
    write: (paths: string[], text: string) => ipcRenderer.invoke(IPCKeys.FS_WRITE, paths, text),
    subdir: (paths: string[]) => ipcRenderer.invoke(IPCKeys.FS_GET_SUBDIR, paths),
    tree: (paths: string[]) => ipcRenderer.invoke(IPCKeys.FS_GET_TREE, paths),
    exist: (paths: string[]) => ipcRenderer.invoke(IPCKeys.FS_EXIST, paths),
    mkdir: (paths: string[]) => ipcRenderer.invoke(IPCKeys.FS_MKDIR, paths),
    unzip: (zipPaths: string[], outPaths: string[]) => ipcRenderer.invoke(IPCKeys.FS_UNZIP, zipPaths, outPaths),
  },
  github: {
    fetch: (owner: string, repo: string, branch: string, path: string[]) =>
      ipcRenderer.invoke(IPCKeys.GITHUB_FETCH, owner, repo, branch, path),
  },
  run: {
    execa: (command: string, args: string[], cwd: string[], options?: Options) =>
      ipcRenderer.invoke(IPCKeys.RUN_EXECA, command, args, cwd, options),
  },
  web: {
    open: (url: string) => ipcRenderer.invoke(IPCKeys.WEB_OPEN, url),
    fetch: (url: string) => ipcRenderer.invoke(IPCKeys.WEB_FETCH, url),
    clone: (remotePaths: string[], localPaths: string[]) => ipcRenderer.invoke(IPCKeys.WEB_CLONE, remotePaths, localPaths),
    dl: (remotePaths: string[], localPaths: string[]) => ipcRenderer.invoke(IPCKeys.WEB_DL, remotePaths, localPaths),
  },
  config: {
    getColor: () => ipcRenderer.invoke(IPCKeys.CONFIG_GET_COLOR),
    setColor: (color: ConfigJSON["color"]) => ipcRenderer.invoke(IPCKeys.CONFIG_SET_COLOR, color),
    getRecent: () => ipcRenderer.invoke(IPCKeys.CONFIG_GET_RECENT),
    setRecent: (recent: ConfigJSON["recent"]) => ipcRenderer.invoke(IPCKeys.CONFIG_SET_RECENT, recent),
  },
});
