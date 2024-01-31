import { Check, Close, Download, ReplayRounded, Upload } from "@mui/icons-material";
import { FC, Fragment } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useSetRecoilState } from "recoil";
import { dialogState } from "~/web/2_route";
import { localPacksState, mergedPackList, pathState, registoryPackListState, useUpdateRegistory } from "~/web/2_store";
import { Center, Dialog, Grid, IconButton, Left } from "../atom";

export const PackageDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const setDialog = useSetRecoilState(dialogState);
  const appHome = useRecoilValue(pathState);
  const localPacks = useRecoilValue(localPacksState);
  const merged = useRecoilValue(mergedPackList);
  const reload = useRecoilRefresher_UNSTABLE(localPacksState);
  const registory = useRecoilValue(registoryPackListState);
  const reloadRegistory = useUpdateRegistory();
  console.log(localPacks);
  console.log(registory);
  console.table(merged);
  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <Grid row={["50px", "1fr"]}>
        <Grid column={["1fr", "50px"]}>
          <Left style={{ fontSize: 25, fontWeight: "bold" }}>Package</Left>
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
                <IconButton size={30} onClick={() => reload()}>
                  <ReplayRounded />
                </IconButton>
              </Left>
            </>
            {merged.map((pack, i) => (
              <Fragment key={i}>
                <Left>{pack.owner}</Left>
                <Left>{pack.name}</Left>
                <Left>{pack.version}</Left>
                <Center>
                  {pack.remote && !pack.local && (
                    <IconButton size={30} onClick={() => console.log("Download", pack.name)}>
                      <Download />
                    </IconButton>
                  )}
                  {!pack.remote && pack.local && (
                    <IconButton size={30} onClick={() => console.log("Upload", pack.name)}>
                      <Upload />
                    </IconButton>
                  )}
                  {pack.remote && pack.local && (
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
