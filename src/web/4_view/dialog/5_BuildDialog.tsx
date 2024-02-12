import { Close, ReplayRounded, Download, Upload, Check, Construction, AccountTree } from "@mui/icons-material";
import { FC, Fragment } from "react";
import { useSetRecoilState, useRecoilValueLoadable, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { dialogState } from "~/web/2_route";
import { boardListState, boardState, pathState, useColor } from "~/web/2_store";
import { Center, Dialog, IconButton, IconText, Left, layout } from "../atom";

// Replace ${ }

const resolveDependencies = (str: string) => {};

export const BuildDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const setDialog = useSetRecoilState(dialogState);
  const board = useRecoilValue(boardState);
  const color = useColor().dialog;
  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <div style={{ ...layout.colGrid({ column: [null, null] }), overflow: "hidden" }}>
        <div style={{ overflowY: "scroll" }}>
          <IconText Icon={Construction} color={color._} height={40} text={"Tools"} />
          <div style={{ ...layout.colGrid({ column: [200, 60, 60], row: 30 }), height: "auto" }}>
            {board.tools.map(({ name, cmd, inst }, i) => (
              <Fragment key={name}>
                <Left>{name}</Left>
                <button onClick={() => console.log(`TODO: Run install cmd ${inst}`)}>Install</button>
                <button onClick={() => console.log(`TODO: Check tool is installed`)}>Check</button>
              </Fragment>
            ))}
          </div>
          {board.cmd.map((task) => (
            <Fragment key={task.name}>
              <IconText Icon={AccountTree} color={color._} height={40} text={task.name} />
              <div style={{ ...layout.colGrid({ column: [200, 80], row: 20 }), height: "auto" }}>
                {task.src.map((s) => (
                  <Fragment key={s}>
                    <Left>{s}</Left>
                    <Center>✅</Center>
                  </Fragment>
                ))}
              </div>
              <button>↓{task.cmd}</button>
              <div style={{ ...layout.colGrid({ column: [200, 80], row: 20 }), height: "auto" }}>
                {task.out.map((s) => (
                  <Fragment key={s}>
                    <Left>{s}</Left>
                    <Center>✅</Center>
                  </Fragment>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
        <div style={{ background: "black", color: "white" }}>Console</div>
      </div>
    </Dialog>
  );
};
