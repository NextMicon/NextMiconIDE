import { Check, Close, Download, ReplayRounded, Upload } from "@mui/icons-material";
import { FC, Fragment } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { dialogState } from "~/web/2_route";
import { boardListState, pathState } from "~/web/2_store";
import { Center, Dialog, Grid, IconButton, Left } from "~/web/4_view/atom";

export const BoardDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const setDialog = useSetRecoilState(dialogState);
  const boardList = useRecoilValueLoadable(boardListState);
  const refresh = useRecoilRefresher_UNSTABLE(boardListState);
  const home = useRecoilValue(pathState);
  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <Grid row={["50px", "1fr"]}>
        <Grid style={{ height: "50px" }} column={["1fr", "50px"]}>
          <Left style={{ fontSize: 25, fontWeight: "bold" }}>Boards</Left>
          <IconButton onClick={() => setDialog(undefined)}>
            <Close />
          </IconButton>
        </Grid>
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
              <Left style={{ fontWeight: "bold" }}>Owner</Left>
              <Left style={{ fontWeight: "bold" }}>Package</Left>
              <Left style={{ fontWeight: "bold" }}>Version</Left>
              <Left>
                <IconButton size={30} onClick={() => console.log("Reload Packages")}>
                  <ReplayRounded />
                </IconButton>
              </Left>
            </>
            {boardList.getValue().map((pack, i) => (
              <Fragment key={i}>
                <Left>{pack.owner}</Left>
                <Left>{pack.name}</Left>
                <Left>{pack.version}</Left>
                <Center>
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
                </Center>
              </Fragment>
            ))}
          </div>
        </div>
      </Grid>
    </Dialog>
  );
};
