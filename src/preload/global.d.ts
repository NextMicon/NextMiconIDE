import { OpenDialogOptions } from "electron";
import { ExecaReturnValue, Options } from "execa";
import { ConfigJSON } from "~/main/config";

declare global {
  interface Window {
    log: {
      fatal: (message: any, ...args: any[]) => Promise<void>;
      error: (message: any, ...args: any[]) => Promise<void>;
      warn: (message: any, ...args: any[]) => Promise<void>;
      info: (message: any, ...args: any[]) => Promise<void>;
      debug: (message: any, ...args: any[]) => Promise<void>;
      trace: (message: any, ...args: any[]) => Promise<void>;
    };
    ipc: {
      clipboard: {
        copy: (str: string) => Promise<void>;
      };
      dir: {
        getHome: () => Promise<string[]>;
        getHidden: () => Promise<string[]>;
      };
      fs: {
        browse: (opt: OpenDialogOptions) => Promise<string[][]>;
        read: (paths: string[]) => Promise<string>;
        write: (paths: string[], text: string) => Promise<void>;
        subdir: (paths: string[]) => Promise<string[]>;
        tree: (paths: string[]) => Promise<directoryTree.DirectoryTree<Record<string, any>>>;
        exist: (paths: string[]) => Promise<boolean>;
        mkdir: (paths: string[]) => Promise<boolean>;
        unzip: (zipPaths: string[], outPaths: string[]) => Promise<void>;
      };
      github: {
        fetch: (owner: string, repo: string, branch: string, path: string[]) => Promise<string>;
        clone: (owner: string, repo: string, branch: string, local: string[]) => Promise<string>;
      };
      run: {
        execa: (command: string, args: string[], cwd: string[], options?: Options) => Promise<ExecaReturnValue<string>>;
      };
      web: {
        open: (url: string) => Promise<void>;
        fetch: (url: string) => Promise<string>;
        clone: (remotePaths: string[], localPaths: string[]) => Promise<string>;
        dl: (remotePaths: string[], localPaths: string[]) => Promise<void>;
      };
      config: {
        getColor: () => Promise<ConfigJSON["color"]>;
        setColor: (color: ConfigJSON["color"]) => Promise<void>;
        getRecent: () => Promise<ConfigJSON["recent"]>;
        setRecent: (recent: ConfigJSON["recent"]) => Promise<void>;
      };
    };
  }
}
