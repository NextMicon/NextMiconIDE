import { Close, ReplayRounded, Download, Upload, Check } from "@mui/icons-material";
import { FC, Fragment } from "react";
import { useSetRecoilState, useRecoilValueLoadable, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { dialogState } from "~/web/2_route";
import { boardListState, boardState, pathState } from "~/web/2_store";
import { Dialog, Grid, Left, IconButton, Center } from "../atom";

export const BuildDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const setDialog = useSetRecoilState(dialogState);
  const board = useRecoilValue(boardState);
  board.cmd;
  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <h2>Install Tools</h2>
      <ul>
        {board.tools.map(({ name, cmd, inst }, i) => (
          <li key={i}>
            {name} <button onClick={() => console.log(inst)}>Install</button>
          </li>
        ))}
      </ul>
      {board.cmd.map((task) => (
        <>
          <h2>{task.name}</h2>
          {task.src.map((s) => (
            <li>{s} ✅</li>
          ))}
          <button>{task.cmd}</button>
          {task.out.map((s) => {
            <li>{s}</li>;
          })}
        </>
      ))}
    </Dialog>
  );
};
