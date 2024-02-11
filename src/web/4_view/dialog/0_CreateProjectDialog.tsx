import { Close } from "@mui/icons-material";
import { FC, useState } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { dialogState } from "~/web/2_route";
import { boardListState, projectListState, useColor, useCreateProject } from "~/web/2_store";
import { layout, Dialog, IconButton } from "../atom";

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
      <div style={{ ...layout.colGrid({ column: [null, 50], row: 50 }), height: 50 }}>
        <div style={{ ...layout.left, fontSize: 25, fontWeight: "bold" }}>Create Project</div>
        <IconButton color={color.dialog.btn} onClick={() => setDialog(undefined)}>
          <Close />
        </IconButton>
      </div>
      <div style={layout.colGrid({ column: [150, 200], row: 30 })}>
        <>
          <div style={layout.left}>Board</div>
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
          <div style={layout.left}>Version</div>
          <select onChange={(e) => setVersion(e.target.value)}>
            <option value={undefined}>-</option>
            <option>0.0.0</option>
          </select>
        </>
        <>
          <div style={layout.left}>Name</div>
          <input type="text" value={proj} onChange={(e) => setProj(e.target.value)} />
        </>
        <>
          <div style={layout.left}>Create</div>
          <>
            {board && version && proj ? (
              <button
                style={{ background: "lightgray" }}
                onClick={() =>
                  createProject(proj, { owner: "NextMicon", name: board, version: version })
                    .then(() => refreshProjectList())
                    .then(() => setDialog(undefined))
                }
              >
                {`${proj} <= ${board}/${version}`}
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
