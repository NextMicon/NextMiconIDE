import {
  Close,
  ReplayRounded,
  Download,
  Upload,
  Check,
  Construction,
  AccountTree,
  BuildCircle,
  Build,
  DoubleArrow,
} from "@mui/icons-material";
import { FC, Fragment } from "react";
import { useSetRecoilState, useRecoilValueLoadable, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { dialogState } from "~/web/2_route";
import { boardListState, boardState, pathState, useColor, useGenerate, useRunMake } from "~/web/2_store";
import { Center, Dialog, IconButton, IconText, Left, layout } from "../atom";

// Replace ${ }

const resolveDependencies = (str: string) => {};

export const BuildDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const setDialog = useSetRecoilState(dialogState);
  const board = useRecoilValue(boardState);
  const color = useColor().dialog;
  const gen = useGenerate();
  const runMake = useRunMake();
  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <div style={{ overflowY: "scroll" }}>
        <div style={{ ...layout.left, fontSize: 20, height: "auto" }}>{"Tools"}</div>
        <div style={{ ...layout.colGrid({ column: [20, null, 60, 60], row: 30 }), height: "auto" }}>
          {board.tools.map(({ name, cmd, inst }, i) => (
            <Fragment key={name}>
              <div></div>
              <Left>{name}</Left>
              <button onClick={() => console.log(`TODO: Run install cmd ${inst}`)}>Install</button>
              <button onClick={() => console.log(`TODO: Check tool is installed`)}>Check</button>
            </Fragment>
          ))}
        </div>
        {board.cmd.map((task) => (
          <Fragment key={task.name}>
            <div style={{ ...layout.left, fontSize: 20, height: "auto" }}>{task.name}</div>
            <div style={{ ...layout.colGrid({ column: [20, 40, null], row: 30 }), height: "auto" }}>
              {task.src.map((s) => (
                <Fragment key={s}>
                  <div></div>
                  <Center>✅</Center>
                  <Left>{s}</Left>
                </Fragment>
              ))}
              <>
                <div></div>
                <button
                  style={{ width: "100%", padding: 0, cursor: "pointer", gridColumn: "2 / 4" }}
                  onClick={() => {
                    if (task.cmd === "mgen") gen();
                    else if (task.cmd === "make") runMake();
                  }}
                >
                  <IconText color={color._} text={task.cmd} Icon={DoubleArrow} height={30} />
                </button>
              </>
              {task.out.map((s) => (
                <Fragment key={s}>
                  <div></div>
                  <Center>✅</Center>
                  <Left>{s}</Left>
                </Fragment>
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </Dialog>
  );
};
