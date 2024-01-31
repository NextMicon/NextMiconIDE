import { atom } from "recoil";

// --------------------------------------------------------------------------------
// SPA Routing
// (./login) ← for online editor
// ./home
// ./editor?project=/path/to/project

type Route = { page: "home" } | { page: "editor"; project: string[] };

export const routeState = atom<Route>({ key: "route", default: { page: "home" } });

type Dialog = "createProject" | "setting" | "package" | "board";

export const dialogState = atom<Dialog | undefined>({ key: "dialog", default: undefined });
