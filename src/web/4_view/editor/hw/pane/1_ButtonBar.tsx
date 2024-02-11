import { Apps, CommitSharp, DeleteOutline, Flip, InfoOutlined, Redo, SaveOutlined, Undo } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { paneState, useColor } from "~/web/2_store";
import { useButtonAction } from "~/web/3_facade";
import { IconButton, layout } from "~/web/4_view/atom";

export const ButtonBar = () => {
  const color = useColor();
  const { undo, redo, save, flip, del } = useButtonAction();
  return (
    <div
      style={{
        ...layout.grid({ row: ["50px", "50px", "50px", "50px", "50px", "50px", "50px"] }),
        width: "50px",
        background: color.editor.hw.sidebar._.bg,
      }}
    >
      <div style={layout.center}>
        <IconButton color={color.editor.hw.sidebar.btn} size={40} onClick={() => undo()}>
          <Undo />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.editor.hw.sidebar.btn} size={40} onClick={() => redo()}>
          <Redo />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.editor.hw.sidebar.btn} size={40} onClick={() => save()}>
          <SaveOutlined />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.editor.hw.sidebar.btn} size={40} onClick={() => flip()}>
          <Flip />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.editor.hw.sidebar.btn} size={40} onClick={() => del()}>
          <DeleteOutline />
        </IconButton>
      </div>
    </div>
  );
};

export const TabButton = () => {
  const color = useColor();
  const [infoPane, setInfoPane] = useRecoilState(paneState);
  return (
    <div style={{ ...layout.grid({ column: ["50px", "50px", "50px"] }), height: "50px", background: color.editor.hw.list.bg }}>
      <div style={layout.center}>
        <IconButton color={color.editor.hw.sidebar.btn} size={40} onClick={() => setInfoPane({ type: "info" })}>
          <InfoOutlined />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.editor.hw.sidebar.btn} size={40} onClick={() => setInfoPane({ type: "pack" })}>
          <Apps />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.editor.hw.sidebar.btn} size={40} onClick={() => setInfoPane({ type: "ioport" })}>
          <CommitSharp />
        </IconButton>
      </div>
    </div>
  );
};
