import { Allotment } from "allotment";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { hweditorSizesState, paneState, useColor } from "~/web/2_store";
import { useHWEditorFacade } from "~/web/3_facade";
import { MiconEditor } from "./graph/MiconEditor";
import { layout } from "../../atom";
import { EditorToolBar, PaneTabBar } from "./toolbar/ButtonBar";
import { InfoPane } from "./pane/1_InfoPane";
import { PackagePane } from "./pane/2_PackagePane";
import { IoportPane } from "./pane/3_IoportPane";

export const HWEditor = () => {
  const { keyboard } = useHWEditorFacade();
  useEffect(() => {
    document.addEventListener("keydown", keyboard);
    return () => document.removeEventListener("keydown", keyboard);
  }, [keyboard]);

  const [sizes, setSizes] = useRecoilState(hweditorSizesState);
  const pane = useRecoilValue(paneState);
  const color = useColor();

  return (
    <Allotment onChange={setSizes} defaultSizes={sizes}>
      <Allotment.Pane preferredSize={400} minSize={50}>
        <div style={{ ...layout.grid({ column: [50, null] }), background: color.editor.hw.pane._.bg }}>
          <PaneTabBar />
          <div style={{ overflow: "scroll" }}>
            {pane.type === "info" && <InfoPane />}
            {pane.type === "pack" && <PackagePane />}
            {pane.type === "ioport" && <IoportPane />}
          </div>
        </div>
      </Allotment.Pane>
      <Allotment.Pane minSize={50}>
        <div style={{ ...layout.grid({ column: [null, 50] }), background: color.editor.hw.graph.canvas.bg }}>
          <MiconEditor />
          <EditorToolBar />
        </div>
      </Allotment.Pane>
    </Allotment>
  );
};
