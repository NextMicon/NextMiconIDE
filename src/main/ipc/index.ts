import { configHandler } from "./config";
import { fsHandler } from "./fs";
import { githubHandler } from "./github";
import { logHandler } from "./log";
import { runHandler } from "./run";
import { sysHandler } from "./sys";
import { webHandler } from "./web";

export const setIPCHandler = () => {
  logHandler();
  fsHandler();
  webHandler();
  githubHandler();
  runHandler();
  sysHandler();
  configHandler();
};
