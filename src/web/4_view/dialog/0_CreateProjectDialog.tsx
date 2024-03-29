import { Close } from "@mui/icons-material";
import { FC, useState } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { dialogState } from "~/web/2_route";
import { boardListState, projectListState, useColor, useCreateProject } from "~/web/2_store";
import { css, Dialog, IconButton, Left } from "../atom";

export const CreateProjectDialog: FC<{ zIndex: number }> = ({ zIndex }) => {
  const color = useColor();
  const setDialog = useSetRecoilState(dialogState);
  const boardListLoaddable = useRecoilValueLoadable(boardListState);

  const [board, setBoard] = useState<string | undefined>(undefined);
  const [version, setVersion] = useState<string | undefined>(undefined);
  const [proj, setProj] = useState<string>("");

  const createProject = useCreateProject();
  const refreshProjectList = useRecoilRefresher_UNSTABLE(projectListState);

  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <div style={{ ...css.colGrid({ column: [null, 50], row: 50 }), height: 50 }}>
        <div style={{ ...css.left, fontSize: 25, fontWeight: "bold" }}>Create Project</div>
        <IconButton color={color.dialog.btn} onClick={() => setDialog(undefined)}>
          <Close />
        </IconButton>
      </div>
      <div style={css.colGrid({ column: [150, 200], row: 30 })}>
        <>
          <Left>Board</Left>
          <select onChange={(e) => setBoard(e.target.value)} value={board}>
            <option value={undefined}>-</option>
            {boardListLoaddable.getValue().map((board, i) => (
              <option key={i} value={board.name}>
                {board.name}
              </option>
            ))}
          </select>
        </>
        <>
          <Left>Version</Left>
          <select onChange={(e) => setVersion(e.target.value)}>
            <option value={undefined}>-</option>
            <option>0.0.0</option>
          </select>
        </>
        <>
          <Left>Name</Left>
          <input type="text" value={proj} onChange={(e) => setProj(e.target.value)} />
        </>
        <>
          <Left>Create</Left>
          <>
            {board && version && proj ? (
              <button
                style={{ background: "lightgray", cursor: "pointer" }}
                onClick={() =>
                  createProject(proj, { owner: "NextMicon", name: board, version: version })
                    .then(() => refreshProjectList())
                    .then(() => setDialog(undefined))
                }
              >
                {"Create!"}
              </button>
            ) : (
              <div></div>
            )}
          </>
        </>
      </div>
    </Dialog>
  );
};
