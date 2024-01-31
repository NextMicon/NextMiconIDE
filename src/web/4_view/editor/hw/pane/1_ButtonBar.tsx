import { Apps, CommitSharp, DeleteOutline, Flip, InfoOutlined, Redo, SaveOutlined, Undo } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { paneState, useColor } from "~/web/2_store";
import { useButtonAction } from "~/web/3_facade";
import { Center, Grid, IconButton } from "~/web/4_view/atom";

export const ButtonBar = () => {
  const color = useColor();
  const { undo, redo, save, flip, del } = useButtonAction();
  return (
    <Grid
      style={{ width: "50px", background: color.primary.mid }}
      row={["50px", "50px", "50px", "50px", "50px", "50px", "50px"]}
      column={["100%"]}
    >
      <Center>
        <IconButton size={40} onClick={() => undo()}>
          <Undo />
        </IconButton>
      </Center>
      <Center>
        <IconButton size={40} onClick={() => redo()}>
          <Redo />
        </IconButton>
      </Center>
      <Center>
        <IconButton size={40} onClick={() => save()}>
          <SaveOutlined />
        </IconButton>
      </Center>
      <Center>
        <IconButton size={40} onClick={() => flip()}>
          <Flip />
        </IconButton>
      </Center>
      <Center>
        <IconButton size={40} onClick={() => del()}>
          <DeleteOutline />
        </IconButton>
      </Center>
    </Grid>
  );
};

export const TabButton = () => {
  const color = useColor();
  const [infoPane, setInfoPane] = useRecoilState(paneState);
  return (
    <Grid style={{ height: "50px", background: color.gray.mid }} column={["50px", "50px", "50px"]}>
      <Center>
        <IconButton size={40} onClick={() => setInfoPane({ type: "info" })} forceHover={infoPane.type === "info"}>
          <InfoOutlined />
        </IconButton>
      </Center>
      <Center>
        <IconButton size={40} onClick={() => setInfoPane({ type: "pack" })} forceHover={infoPane.type === "pack"}>
          <Apps />
        </IconButton>
      </Center>
      <Center>
        <IconButton size={40} onClick={() => setInfoPane({ type: "ioport" })} forceHover={infoPane.type === "ioport"}>
          <CommitSharp />
        </IconButton>
      </Center>
    </Grid>
  );
};
