import { Allotment } from "allotment";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { hweditorSizesState } from "~/web/2_store";
import { useHWEditorFacade } from "~/web/3_facade";
import { MiconEditor } from "./graph/MiconEditor";
import { ReplayController } from "./graph/ReplayController";
import { SidePane } from "./pane";

export const HWEditor = () => {
  const { keyboard } = useHWEditorFacade();
  useEffect(() => {
    document.addEventListener("keydown", keyboard);
    return () => document.removeEventListener("keydown", keyboard);
  }, [keyboard]);

  const [sizes, setSizes] = useRecoilState(hweditorSizesState);

  return (
    <Allotment onChange={setSizes} defaultSizes={sizes}>
      <Allotment.Pane preferredSize={400} minSize={50}>
        <SidePane />
      </Allotment.Pane>
      <Allotment.Pane>
        <div>
          <MiconEditor />
          {/* <ReplayController size={40} /> */}
        </div>
      </Allotment.Pane>
    </Allotment>
  );
};
