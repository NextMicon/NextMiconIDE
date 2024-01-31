import { app, clipboard, ipcMain } from "electron";
import { join, sep } from "path";
import { IPCKeys } from "~/ipckey";

export const sysHandler = () => {
  ipcMain.handle(IPCKeys.SYS_HOME, (_) => {
    const home = join(app.getPath("home"), app.getName()).split(sep);
    return process.platform === "win32" ? home : ["/", ...home];
  });
  ipcMain.handle(IPCKeys.SYS_HIDDEN, (_) => {
    const hidden = app.getPath("userData").split(sep);
    return process.platform === "win32" ? hidden : ["/", ...hidden];
  });
  ipcMain.handle(IPCKeys.SYS_COPY, (_, str) => clipboard.writeText(str, "clipboard"));
};
