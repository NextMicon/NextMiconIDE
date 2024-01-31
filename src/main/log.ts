import { app } from "electron";
import log4js from "log4js";
import path from "path";
import util from "util";

export const initLog4js = () => {
  const logDirectory = path.join(app.getPath("userData"), "log");

  const logLayout = {
    type: "colored",
    pattern: "[%d] [%-5p] %c %f:%l %x{singleLine}",
    tokens: {
      singleLine: function (logEvent: { data: Array<unknown> }) {
        return logEvent.data
          .map((d) => {
            if (typeof d === "boolean" || typeof d === "number" || typeof d === "string") {
              return d.toString().replace(/\n/gm, "\\n");
            } else {
              return util.inspect(d, { breakLength: Infinity }).replace(/\n/gm, "\\n");
            }
          })
          .filter((d) => d.length > 0)
          .join(" ");
      },
    },
  };

  log4js.configure({
    appenders: {
      console: {
        type: "console",
        layout: { type: "colored" },
      },
      app: {
        type: "dateFile",
        layout: { type: "basic" },
        filename: path.join(logDirectory, "app.log"),
        pattern: "-yyyy-MM-dd",
        daysToKeep: 7,
        compress: true,
      },
    },
    categories: {
      default: {
        appenders: ["console", "app"],
        level: "all",
        enableCallStack: true,
      },
    },
  });
};
