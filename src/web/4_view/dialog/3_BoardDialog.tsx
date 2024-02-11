import { Check, Close, Download, ReplayRounded, Upload } from "@mui/icons-material";
import { FC, Fragment } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { dialogState } from "~/web/2_route";
import { boardListState, pathState } from "~/web/2_store";
import { Dialog, IconButton, layout } from "~/web/4_view/atom";

export const BoardDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const setDialog = useSetRecoilState(dialogState);
  const boardList = useRecoilValueLoadable(boardListState);
  const refresh = useRecoilRefresher_UNSTABLE(boardListState);
  const home = useRecoilValue(pathState);
  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <div style={layout.grid({ row: ["50px", "1fr"] })}>
        <div style={{ ...layout.grid({ row: ["1fr", "50px"] }), height: "50px" }}>
          <div style={{ ...layout.left, fontSize: 25, fontWeight: "bold" }}>Boards</div>
          <IconButton onClick={() => setDialog(undefined)}>
            <Close />
          </IconButton>
        </div>
        <div style={{ overflow: "scroll" }}>
          <div
            style={{
              height: "auto",
              display: "grid",
              gridAutoColumns: "30px",
              gridTemplateColumns: "1fr 1fr 1fr 30px",
            }}
          >
            <>
              <div style={{ ...layout.left, fontWeight: "bold" }}>Owner</div>
              <div style={{ ...layout.left, fontWeight: "bold" }}>Package</div>
              <div style={{ ...layout.left, fontWeight: "bold" }}>Version</div>
              <div>
                <IconButton size={30} onClick={() => console.log("Reload Packages")}>
                  <ReplayRounded />
                </IconButton>
              </div>
            </>
            {boardList.getValue().map((pack, i) => (
              <Fragment key={i}>
                <div style={layout.left}>{pack.owner}</div>
                <div style={layout.left}>{pack.name}</div>
                <div style={layout.left}>{pack.version}</div>
                <div style={layout.center}>
                  {i % 3 === 0 && (
                    <IconButton size={30} onClick={() => console.log("Download", pack.name)}>
                      <Download />
                    </IconButton>
                  )}
                  {i % 3 === 1 && (
                    <IconButton size={30} onClick={() => console.log("Upload", pack.name)}>
                      <Upload />
                    </IconButton>
                  )}
                  {i % 3 === 2 && (
                    <IconButton size={30} onClick={() => console.log("OK", pack.name)}>
                      <Check />
                    </IconButton>
                  )}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
