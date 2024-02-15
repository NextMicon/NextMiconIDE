import { atom } from "recoil";

type Pane = { type: "info" } | { type: "primitive" } | { type: "pack" };

export const paneState = atom<Pane>({ key: "paneState", default: { type: "info" } });
