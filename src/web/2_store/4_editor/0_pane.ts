import { atom } from "recoil";

type Pane = { type: "info" } | { type: "pack" } | { type: "ioport" };

export const paneState = atom<Pane>({ key: "paneState", default: { type: "info" } });
