import { Check, Close, Download, ReplayRounded, Upload } from "@mui/icons-material";
import { FC, Fragment } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useSetRecoilState } from "recoil";
import { dialogState } from "~/web/2_route";
import { localPacksState, mergedPackList, registoryPackListState, useColor, useDownloadPackage, useUpdateRegistory } from "~/web/2_store";
import { Dialog, IconButton, css } from "../atom";

export const PackageDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const color = useColor();
  const setDialog = useSetRecoilState(dialogState);
  const localPacks = useRecoilValue(localPacksState);
  const merged = useRecoilValue(mergedPackList);
  const reload = useRecoilRefresher_UNSTABLE(localPacksState);
  const registory = useRecoilValue(registoryPackListState);
  const reloadRegistory = useUpdateRegistory();
  const downloadPackage = useDownloadPackage();

  console.log(localPacks);
  console.log(registory);
  console.table(merged);
  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <div style={css.rowGrid({ row: [50, null] })}>
        <div style={css.colGrid({ column: [null, 50] })}>
          <div style={{ ...css.left, fontSize: 25, fontWeight: "bold" }}>Package</div>
          <IconButton color={color.dialog.btn} onClick={() => setDialog(undefined)}>
            <Close />
          </IconButton>
        </div>
        <div style={{ overflow: "scroll" }}>
          <div style={css.colGrid({ column: [null, null, null, 30], row: 30 })}>
            <>
              <div style={{ ...css.left, fontWeight: "bold" }}>Owner</div>
              <div style={{ ...css.left, fontWeight: "bold" }}>Package</div>
              <div style={{ ...css.left, fontWeight: "bold" }}>Version</div>
              <div style={{ ...css.left }}>
                <IconButton color={color.dialog.btn} size={30} onClick={() => reloadRegistory().then(() => reload())}>
                  <ReplayRounded />
                </IconButton>
              </div>
            </>
            {merged.map((pack, i) => (
              <Fragment key={i}>
                <div style={{ ...css.left }}>{pack.owner}</div>
                <div style={{ ...css.left }}>{pack.name}</div>
                <div style={{ ...css.left }}>{pack.version}</div>
                <div style={{ ...css.center }}>
                  {pack.remote && !pack.local && (
                    <IconButton color={color.dialog.btn} size={30} onClick={() => downloadPackage(pack).then(() => reload())}>
                      <Download />
                    </IconButton>
                  )}
                  {!pack.remote && pack.local && (
                    <IconButton color={color.dialog.btn} size={30} onClick={() => console.log("Upload", pack.name)}>
                      <Upload />
                    </IconButton>
                  )}
                  {pack.remote && pack.local && (
                    <IconButton color={color.dialog.btn} size={30} onClick={() => downloadPackage(pack).then(() => reload())}>
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
