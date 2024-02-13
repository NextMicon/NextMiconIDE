import { Close } from "@mui/icons-material";
import { FC } from "react";
import { useSetRecoilState } from "recoil";
import { dialogState } from "~/web/2_route";
import { colorThemes, useColor, useSetColorName } from "~/web/2_store";
import { Dialog, IconButton, css } from "../atom";

export const SettingDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const color = useColor();
  const setDialog = useSetRecoilState(dialogState);
  const { colorName, setColorName } = useSetColorName();
  const colors = Object.entries(colorThemes);

  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <div style={{ ...css.colGrid({ column: [null, 50] }), height: 50 }}>
        <div style={{ ...css.left, fontSize: 25, fontWeight: "bold" }}>Settings</div>
        <IconButton color={color.dialog.btn} onClick={() => setDialog(undefined)}>
          <Close />
        </IconButton>
      </div>
      <div style={css.colGrid({ column: [150, 200], row: 30 })}>
        <>
          <div style={css.left}>Color</div>
          <select value={colorName} onChange={(e) => setColorName(e.target.value)}>
            {colors.map(([k, _]) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </>
        <>
          <div style={{ ...css.left }}>GitHub Token</div>
          <input />
        </>
      </div>
    </Dialog>
  );
};
