import { Close } from "@mui/icons-material";
import { CSSProperties, FC } from "react";
import { useSetRecoilState } from "recoil";
import { dialogState } from "~/web/2_route";
import { useSetColorName } from "~/web/2_store";
import { Dialog, Grid, IconButton, Left, cssLeft } from "../atom";

export const SettingDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const setDialog = useSetRecoilState(dialogState);
  const { colorName, setColorName } = useSetColorName();

  const cssBorder: CSSProperties = { width: "100%", borderWidth: 1, borderColor: "black", borderStyle: "solid" };

  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <Grid style={{ height: "50px" }} column={["1fr", "50px"]}>
        <Left style={{ fontSize: 25, fontWeight: "bold" }}>Settings</Left>
        <IconButton onClick={() => setDialog(undefined)}>
          <Close />
        </IconButton>
      </Grid>
      <div
        style={{
          height: "auto",
          display: "grid",
          gridTemplateColumns: "150px 200px",
        }}
      >
        <>
          <div style={{ ...cssLeft }}>Color</div>
          <div>
            <select value={colorName} onChange={(e) => setColorName(e.target.value)} style={{ ...cssBorder }}>
              <option value={"ai"}>Ai</option>
              <option value={"sakura"}>Sakura</option>
              <option value={"dark"}>Dark Ai</option>
            </select>
          </div>
        </>
        <>
          <div style={{ ...cssLeft }}>GitHub Token</div>
          <div>
            <input style={{ ...cssBorder }} />
          </div>
        </>
      </div>
    </Dialog>
  );
};
