import { ipcMain } from "electron";
import { getLogger } from "log4js";
import { IPCKeys } from "~/ipckey";

export const logHandler = () => {
  ipcMain.handle(IPCKeys.LOG_FATAL, (_, message: any, ...args: any[]) => getLogger("WEB").fatal(message, ...args));
  ipcMain.handle(IPCKeys.LOG_ERROR, (_, message: any, ...args: any[]) => getLogger("WEB").error(message, ...args));
  ipcMain.handle(IPCKeys.LOG_WARN, (_, message: any, ...args: any[]) => getLogger("WEB").warn(message, ...args));
  ipcMain.handle(IPCKeys.LOG_INFO, (_, message: any, ...args: any[]) => getLogger("WEB").info(message, ...args));
  ipcMain.handle(IPCKeys.LOG_DEBUG, (_, message: any, ...args: any[]) => getLogger("WEB").debug(message, ...args));
  ipcMain.handle(IPCKeys.LOG_TRACE, (_, message: any, ...args: any[]) => getLogger("WEB").trace(message, ...args));
};
