import { BrowserWindow, app } from "electron";
import path from "path";
import { Config } from "~/main/config";
import { setIPCHandler } from "~/main/ipc";
import { initLog4js } from "./log";

initLog4js();

export let mainWindow: BrowserWindow;

const createWindow = () => {
  const [x, y, width, height] = Config.window;

  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    title: "Next Micon IDE",
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile("dist/index.html");

  mainWindow.webContents.once("did-finish-load", () => {
    console.log(`Argv: ${process.argv}`);
  });

  mainWindow.on("close", () => {
    Config.window = [...mainWindow.getPosition(), ...mainWindow.getSize()];
  });
};

app.whenReady().then(() => {
  setIPCHandler();
  // ipcMain.handle(IPCKeys.GQL, (_e: any, query: string) => graphql({ schema, source: query }));
  createWindow();
});

app.once("window-all-closed", () => app.quit());
