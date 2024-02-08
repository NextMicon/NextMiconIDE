import "allotment/dist/style.css";
import { FC, useEffect } from "react";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { boardState, modeState, useOpenProject, useOpenSoftware, useRunMake } from "~/web/2_store";
import { Grid } from "~/web/4_view/atom";
import { BottomBar } from "./common/BottomBar";
import { TopBar } from "./common/TopBar";
import { HWEditor } from "./hw/HWEditor";
import { SWeditor } from "./sw/SWEditor";

export const Editor: FC<{ projectPath: string[] }> = ({ projectPath }) => {
  const loading = useRecoilValueLoadable(boardState);
  const openProject = useOpenProject();
  const openSoftware = useOpenSoftware();

  useEffect(() => {
    openProject(projectPath).then(() => openSoftware(projectPath));
  }, [projectPath]);

  return (
    <>
      {loading.state === "loading" && <div>{`Loading project: ${projectPath} `}</div>}
      {loading.state === "hasError" && <div>{`Failed to open project: ${projectPath}`}</div>}
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
    <Grid row={["50px", "1fr", "20px"]}>
      <TopBar />
      {mode === "hardware" && <HWEditor />}
      {mode === "software" && <SWeditor />}
      <BottomBar />
    </Grid>
  );
};
