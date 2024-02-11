import { useRecoilValue } from "recoil";
import { paneState, useColor } from "~/web/2_store";
import { layout } from "~/web/4_view/atom";
import { ButtonBar, TabButton } from "./1_ButtonBar";
import { InfoPane } from "./2_InfoPane";
import { PackagePane } from "./3_PackagePane";
import { IoportPane } from "./4_IoportPane";

export const SidePane = () => {
  const pane = useRecoilValue(paneState);
  const color = useColor();
  return (
    <div style={{ ...layout.grid({ column: ["50px", "1fr"] }) }}>
      <ButtonBar />
      <div style={layout.grid({ row: ["50px", "1fr"] })}>
        <TabButton />
        <div style={{ overflow: "scroll", background: color.editor.hw.sidebar._.bg }}>
          {pane.type === "info" && <InfoPane />}
          {/* {pane.type === "pack" && <PackagePane />} */}
          {/* {pane.type === "ioport" && <IoportPane />} */}
        </div>
      </div>
    </div>
  );
};
