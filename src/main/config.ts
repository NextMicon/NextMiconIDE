import ElectronStore from "electron-store";

export interface ConfigJSON {
  window: number[];
  color: string;
  recent: string[];
  github_token: string;
}

class _Config {
  private store = new ElectronStore<ConfigJSON>();

  get window(): ConfigJSON["window"] {
    return this.store.get("window", [0, 0, 800, 600]);
  }
  set window(newval: ConfigJSON["window"]) {
    this.store.set("window", newval);
  }

  get color(): ConfigJSON["color"] {
    return this.store.get("color", "sakura");
  }
  set color(color: ConfigJSON["color"]) {
    this.store.set("color", color);
  }

  get recent(): ConfigJSON["recent"] {
    return this.store.get("recent", []);
  }
  set recent(path: ConfigJSON["recent"]) {
    this.store.set("recent", path);
  }

  get github_token(): ConfigJSON["github_token"] {
    return this.store.get("github_token");
  }
  set github_token(val: ConfigJSON["github_token"]) {
    this.store.set("github_token", val);
  }
}

export const Config = new _Config();
