import directoryTree from "directory-tree";
import { OpenDialogOptions, dialog, ipcMain } from "electron";
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { getLogger } from "log4js";
import { dirname, join, sep } from "path";
import { IPCKeys } from "~/ipckey";
import { mainWindow } from "~/main/main";
import unzip from "unzipper";

const log = getLogger("IPC");

export const fsHandler = () => {
  // Open File Browser
  ipcMain.handle(IPCKeys.FS_BROWSE, async (_, opt: OpenDialogOptions) => {
    log.trace(IPCKeys.FS_BROWSE);
    return dialog.showOpenDialog(mainWindow, opt).then((result) => result.filePaths.map((s) => s.split(sep)));
  });

  // Read File
  ipcMain.handle(IPCKeys.FS_READ, (_, paths: string[]): string => {
    log.trace(IPCKeys.FS_READ, join(...paths));
    try {
      return readFileSync(join(...paths)).toString();
    } catch (e) {
      throw e;
    }
  });

  // Write File
  ipcMain.handle(IPCKeys.FS_WRITE, (_, paths: string[], text: string): void => {
    const path = join(...paths);
    const dir = dirname(path);
    log.trace(IPCKeys.FS_WRITE, path);
    if (!existsSync(dir)) mkdirSync(dir);
    try {
      return writeFileSync(join(...paths), text, { flag: "w" });
    } catch (e) {
      throw e;
    }
  });

  // Get items in a directory
  ipcMain.handle(IPCKeys.FS_GET_SUBDIR, (_, paths: string[]): string[] => {
    const path = join(...paths);
    log.trace(IPCKeys.FS_GET_SUBDIR, path);
    try {
      return readdirSync(path, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    } catch (e) {
      throw e;
    }
  });

  // Get directory tree
  ipcMain.handle(IPCKeys.FS_GET_TREE, (_, paths: string[]): directoryTree.DirectoryTree<Record<string, any>> => {
    const path = join(...paths);
    log.trace(IPCKeys.FS_GET_TREE, path);
    try {
      const tree = directoryTree(path, { normalizePath: true });
      return tree;
    } catch (e) {
      throw e;
    }
  });

  ipcMain.handle(IPCKeys.FS_EXIST, (_, paths: string[]) => {
    const path = join(...paths);
    log.trace(IPCKeys.FS_EXIST, path);
    try {
      return existsSync(path);
    } catch (e) {
      return false;
    }
  });

  ipcMain.handle(IPCKeys.FS_MKDIR, (_, paths: string[]) => {
    const path = join(...paths);
    log.trace(IPCKeys.FS_MKDIR, path);
    try {
      const exist = existsSync(path);
      if (!exist) mkdirSync(path, { recursive: true });
      return true;
    } catch (e) {
      throw e;
    }
  });

  ipcMain.handle(IPCKeys.FS_UNZIP, (_, zipPaths: string[], outPaths: string[]) => {
    const zipPath = join(...zipPaths);
    const outPath = join(...outPaths);
    log.trace(IPCKeys.FS_UNZIP, zipPath, outPath);
    try {
      if (!zipPaths.at(-1)?.endsWith(".zip")) {
        throw `Zipfile required: ${zipPath}`;
      }
      const stream = createReadStream(zipPath);
      stream.pipe(unzip.Extract({ path: outPath }));
    } catch (e) {
      throw e;
    }
  });
};
