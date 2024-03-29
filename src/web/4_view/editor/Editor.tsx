import { FC, useEffect } from "react";
import { useRecoilState, useRecoilValueLoadable } from "recoil";

import "allotment/dist/style.css";
import { boardState, modeState, useOpenProject, useOpenSoftware, useRunMake } from "~/web/2_store";
import { BottomBar } from "./common/BottomBar";
import { TopBar } from "./common/TopBar";
import { HWEditor } from "./hw/HWEditor";
import { SWeditor } from "./sw/SWEditor";
import { css } from "../atom";

export const Editor: FC<{ projectPath: string[] }> = ({ projectPath }) => {
  const loading = useRecoilValueLoadable(boardState);
  const openProject = useOpenProject();
  const openSoftware = useOpenSoftware();

  useEffect(() => {
    openProject(projectPath).then(() => openSoftware(projectPath));
  }, [projectPath]);

  return (
    <>
      {loading.state === "loading" && <div>{`Loading project: ${projectPath.join("/").replaceAll("///", "/")} `}</div>}
      {loading.state === "hasError" && <div>{`Failed to open project: ${projectPath.join("/").replaceAll("///", "/")}`}</div>}
      {loading.state === "hasValue" && <EditorLoadded />}
    </>
  );
};

const EditorLoadded = () => {
  const [mode, setMode] = useRecoilState(modeState);
  const runMake = useRunMake();

  const keyboardEventHandler = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Tab") {
      if (mode === "hardware") setMode("software");
      if (mode === "software") setMode("hardware");
    }
    if (e.ctrlKey && e.key === "Enter") {
      runMake("upload");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyboardEventHandler);
    return () => document.removeEventListener("keydown", keyboardEventHandler);
  }, [keyboardEventHandler]);

  return (
    <div style={{ ...css.rowGrid({ row: [50, null, 20] }), height: "100%" }}>
      <TopBar />
      {mode === "hardware" && <HWEditor />}
      {mode === "software" && <SWeditor />}
      <BottomBar />
    </div>
  );
};
