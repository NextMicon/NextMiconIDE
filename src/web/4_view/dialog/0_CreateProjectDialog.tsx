import { Close } from "@mui/icons-material";
import { CSSProperties, FC, useState } from "react";
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

  const cssBorder: CSSProperties = { width: "100%", borderWidth: 1, borderColor: "black", borderStyle: "solid" };

  return (
    <Dialog zIndex={zIndex} close={() => setDialog(undefined)}>
      <div style={{ ...layout.colGrid({ column: ["1fr", "50px"] }), height: "50px" }}>
        <div style={{ ...layout.left, fontSize: 25, fontWeight: "bold" }}>Create Project</div>
        <IconButton color={color.dialog.btn} onClick={() => setDialog(undefined)}>
          <Close />
        </IconButton>
      </div>
      <div style={{ ...layout.colGrid({ column: ["100px", "200px"] }) }}>
        <>
          <div style={{ ...layout.left }}>Board</div>
          <div>
            <select onChange={(e) => setBoard(e.target.value)} value={board} style={{ ...cssBorder }}>
              <option value={undefined}>-</option>
              {boardListLoaddable.getValue().map((board, i) => (
                <option key={i} value={board.name}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>
        </>
        <>
          <div style={{ ...layout.left }}>Version</div>
          <div>
            <select onChange={(e) => setVersion(e.target.value)} style={{ ...cssBorder }}>
              <option value={undefined}>-</option>
              <option>0.0.0</option>
            </select>
          </div>
        </>
        <>
          <div style={{ ...layout.left }}>Name</div>
          <div>
            <input type="text" style={{ ...cssBorder }} value={proj} onChange={(e) => setProj(e.target.value)} />
          </div>
        </>
        <>
          <div></div>
          <div>
            {board && version && proj && (
              <button
                style={{ ...cssBorder, background: "lightgray" }}
                onClick={() =>
                  createProject(proj, { owner: "NextMicon", name: board, version: "0.0.0" })
                    .then(() => refreshProjectList())
                    .then(() => setDialog(undefined))
                }
              >
                Create!
              </button>
            )}
          </div>
        </>
      </div>
    </Dialog>
  );
};
