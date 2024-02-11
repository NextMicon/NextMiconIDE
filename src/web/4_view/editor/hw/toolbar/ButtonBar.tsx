import { Apps, CommitSharp, DeleteOutline, Flip, InfoOutlined, Redo, SaveOutlined, Undo } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { paneState, useColor } from "~/web/2_store";
import { useButtonAction } from "~/web/3_facade";
import { IconButton, layout } from "~/web/4_view/atom";

export const ButtonBar = () => {
  const color = useColor().editor.hw.toolbar;
  const { undo, redo, save, flip, del } = useButtonAction();
  const [infoPane, setInfoPane] = useRecoilState(paneState);
  return (
    <div style={{ ...layout.grid({ row: [50, 50, 50, 50, 50, 50, 50, 50] }), width: 50, background: color._.bg }}>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "info" })}>
          <InfoOutlined />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "pack" })}>
          <Apps />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "ioport" })}>
          <CommitSharp />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => undo()}>
          <Undo />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => redo()}>
          <Redo />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => save()}>
          <SaveOutlined />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => flip()}>
          <Flip />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => del()}>
          <DeleteOutline />
        </IconButton>
      </div>
    </div>
  );
};

export const PaneTabBar = () => {
  const color = useColor().editor.hw.toolbar;
  const [infoPane, setInfoPane] = useRecoilState(paneState);
  return (
    <div style={{ ...layout.grid({ row: [50, 50, 50] }), width: 50, background: color._.bg }}>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "info" })}>
          <InfoOutlined />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "pack" })}>
          <Apps />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "ioport" })}>
          <CommitSharp />
        </IconButton>
      </div>
    </div>
  );
};

export const EditorToolBar = () => {
  const color = useColor().editor.hw.toolbar;
  const { undo, redo, save, flip, del } = useButtonAction();
  return (
    <div style={{ ...layout.grid({ row: [50, 50, 50, 50, 50] }), width: 50, background: color._.bg }}>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => undo()}>
          <Undo />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => redo()}>
          <Redo />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => save()}>
          <SaveOutlined />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => flip()}>
          <Flip />
        </IconButton>
      </div>
      <div style={layout.center}>
        <IconButton color={color.btn} size={40} onClick={() => del()}>
          <DeleteOutline />
        </IconButton>
      </div>
    </div>
  );
};
