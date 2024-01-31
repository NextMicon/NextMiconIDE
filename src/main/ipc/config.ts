import { ipcMain } from "electron";
import { getLogger } from "log4js";
import { IPCKeys } from "~/ipckey";
import { Config, ConfigJSON } from "~/main/config";

const log = getLogger("IPC");

export const configHandler = () => {
  ipcMain.handle(IPCKeys.CONFIG_GET_COLOR, (_) => {
    log.trace(IPCKeys.CONFIG_GET_COLOR, Config.color);
    return Config.color;
  });
  ipcMain.handle(IPCKeys.CONFIG_SET_COLOR, (_, color: ConfigJSON["color"]) => {
    log.trace(IPCKeys.CONFIG_SET_COLOR, color);
    Config.color = color;
  });

  ipcMain.handle(IPCKeys.CONFIG_GET_RECENT, (_) => {
    log.trace(IPCKeys.CONFIG_GET_RECENT, Config.recent);
    return Config.recent;
  });
  ipcMain.handle(IPCKeys.CONFIG_SET_RECENT, (_, recent: ConfigJSON["recent"]) => {
    log.trace(IPCKeys.CONFIG_SET_RECENT, recent);
    Config.recent = recent;
  });
};
