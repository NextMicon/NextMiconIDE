import { Close } from "@mui/icons-material";
import { FC } from "react";
import { useSetRecoilState } from "recoil";
import { dialogState } from "~/web/2_route";
import { useColor, useSetColorName } from "~/web/2_store";
import { Dialog, IconButton, layout } from "../atom";

export const SettingDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const color = useColor();
  const setDialog = useSetRecoilState(dialogState);
  const { colorName, setColorName } = useSetColorName();

  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <div style={{ ...layout.colGrid({ column: [null, 50] }), height: 50 }}>
        <div style={{ ...layout.left, fontSize: 25, fontWeight: "bold" }}>Settings</div>
        <IconButton color={color.dialog.btn} onClick={() => setDialog(undefined)}>
          <Close />
        </IconButton>
      </div>
      <div style={layout.colGrid({ column: [150, 200], row: 30 })}>
        <>
          <div style={layout.left}>Color</div>
          <select value={colorName} onChange={(e) => setColorName(e.target.value)}>
            <option value={"ai"}>Ai</option>
            <option value={"sakura"}>Sakura</option>
            <option value={"dark"}>Dark Ai</option>
          </select>
        </>
        <>
          <div style={{ ...layout.left }}>GitHub Token</div>
          <input />
        </>
      </div>
    </Dialog>
  );
};
