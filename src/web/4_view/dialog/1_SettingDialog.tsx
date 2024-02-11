import { Close } from "@mui/icons-material";
import { CSSProperties, FC } from "react";
import { useSetRecoilState } from "recoil";
import { dialogState } from "~/web/2_route";
import { useColor, useSetColorName } from "~/web/2_store";
import { Dialog, IconButton, layout } from "../atom";

export const SettingDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const color = useColor();
  const setDialog = useSetRecoilState(dialogState);
  const { colorName, setColorName } = useSetColorName();

  const cssBorder: CSSProperties = { width: "100%", borderWidth: 1, borderColor: "black", borderStyle: "solid" };

  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <div style={{ ...layout.grid({ column: ["1fr", "50px"] }), height: "50px" }}>
        <div style={{ ...layout.left, fontSize: 25, fontWeight: "bold" }}>Settings</div>
        <IconButton color={color.dialog.btn} onClick={() => setDialog(undefined)}>
          <Close />
        </IconButton>
      </div>
      <div
        style={{
          height: "auto",
          display: "grid",
          gridTemplateColumns: "150px 200px",
        }}
      >
        <>
          <div style={{ ...layout.left }}>Color</div>
          <div>
            <select value={colorName} onChange={(e) => setColorName(e.target.value)} style={{ ...cssBorder }}>
              <option value={"ai"}>Ai</option>
              <option value={"sakura"}>Sakura</option>
              <option value={"dark"}>Dark Ai</option>
            </select>
          </div>
        </>
        <>
          <div style={{ ...layout.left }}>GitHub Token</div>
          <div>
            <input style={{ ...cssBorder }} />
          </div>
        </>
      </div>
    </Dialog>
  );
};
