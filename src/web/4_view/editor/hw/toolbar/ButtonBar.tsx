import { Apps, CommitSharp, DeleteOutline, Flip, InfoOutlined, Redo, SaveOutlined, Undo } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { paneState, useColor } from "~/web/2_store";
import { useButtonAction } from "~/web/3_facade";
import { Center, IconButton, layout } from "~/web/4_view/atom";

export const ButtonBar = () => {
  const color = useColor().editor.hw.toolbar;
  const { undo, redo, save, flip, del } = useButtonAction();
  const [infoPane, setInfoPane] = useRecoilState(paneState);
  return (
    <div style={{ ...layout.rowGrid({ row: [50, 50, 50, 50, 50, 50, 50, 50], column: 50 }), width: 50, background: color._.bg }}>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "info" })}>
          <InfoOutlined />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "pack" })}>
          <Apps />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "primitive" })}>
          <CommitSharp />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => undo()}>
          <Undo />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => redo()}>
          <Redo />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => save()}>
          <SaveOutlined />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => flip()}>
          <Flip />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => del()}>
          <DeleteOutline />
        </IconButton>
      </Center>
    </div>
  );
};

export const PaneTabBar = () => {
  const color = useColor().editor.hw.toolbar;
  const [infoPane, setInfoPane] = useRecoilState(paneState);
  return (
    <div style={{ ...layout.rowGrid({ row: [50, 50, 50], column: 50 }), background: color._.bg }}>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "info" })}>
          <InfoOutlined />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "primitive" })}>
          <CommitSharp />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => setInfoPane({ type: "pack" })}>
          <Apps />
        </IconButton>
      </Center>
    </div>
  );
};

export const EditorToolBar = () => {
  const color = useColor().editor.hw.toolbar;
  const { undo, redo, save, flip, del } = useButtonAction();
  return (
    <div style={{ ...layout.rowGrid({ row: [50, 50, 50, 50, 50], column: 50 }), background: color._.bg }}>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => undo()}>
          <Undo />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => redo()}>
          <Redo />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => save()}>
          <SaveOutlined />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => flip()}>
          <Flip />
        </IconButton>
      </Center>
      <Center>
        <IconButton color={color.btn} size={40} onClick={() => del()}>
          <DeleteOutline />
        </IconButton>
      </Center>
    </div>
  );
};
