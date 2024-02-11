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
        background: color.toolbar.bg,
      }}
    >
      <div style={layout.center}>
        <IconButton size={40} onClick={() => undo()}>
          <Undo />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton size={40} onClick={() => redo()}>
          <Redo />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton size={40} onClick={() => save()}>
          <SaveOutlined />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton size={40} onClick={() => flip()}>
          <Flip />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton size={40} onClick={() => del()}>
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
    <div style={{ ...layout.grid({ column: ["50px", "50px", "50px"] }), height: "50px", background: color.hw_list.bg }}>
      <div style={layout.center}>
        <IconButton size={40} onClick={() => setInfoPane({ type: "info" })} forceHover={infoPane.type === "info"}>
          <InfoOutlined />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton size={40} onClick={() => setInfoPane({ type: "pack" })} forceHover={infoPane.type === "pack"}>
          <Apps />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton size={40} onClick={() => setInfoPane({ type: "ioport" })} forceHover={infoPane.type === "ioport"}>
          <CommitSharp />
        </IconButton>
      </div>
    </div>
  );
};
