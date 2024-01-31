import { Apps, DeveloperBoard, NoteAddOutlined, OpenInBrowser, Settings } from "@mui/icons-material";
import { FC } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import "~/assets/logo.png";
import { dialogState, routeState } from "~/web/2_route";
import { Center, Flex, Grid, IconButton, TextButton } from "~/web/4_view/atom";
import { projectListState, useColor } from "../../2_store";

export const Home: FC = () => {
  const color = useColor();

  return (
    <Center style={{ background: color.primary.dark }}>
      <div style={{ maxWidth: "500px", maxHeight: "600px", padding: "20px" }}>
        <Grid row={["1fr", "1fr", "3fr"]}>
          <Center>
            <span style={{ fontWeight: "bold", fontSize: 40, color: "white" }}>Next Micon IDE</span>
          </Center>
          <Buttons />
          <ProjectList />
        </Grid>
      </div>
    </Center>
  );
};

const Buttons: FC = () => {
  const setRoute = useSetRecoilState(routeState);
  const setDialog = useSetRecoilState(dialogState);
  const openProjectWithDialog = () => {
    window.ipc.fs
      .browse({ title: "Select project root directory", properties: ["openDirectory"] })
      .then((paths) => paths.at(0))
      .then((root) => (root ? setRoute({ page: "editor", project: root }) : undefined));
  };
  return (
    <Flex direction="horizontal" justify="space-between" align="center">
      <IconButton size={80} onClick={() => setDialog("createProject")}>
        <NoteAddOutlined />
      </IconButton>
      <IconButton size={80} onClick={openProjectWithDialog}>
        <OpenInBrowser />
      </IconButton>
      <IconButton size={80} onClick={() => setDialog("setting")}>
        <Settings />
      </IconButton>
      <IconButton size={80} onClick={() => setDialog("package")}>
        <Apps />
      </IconButton>
      <IconButton size={80} onClick={() => setDialog("board")}>
        <DeveloperBoard />
      </IconButton>
    </Flex>
  );
};

const ProjectList: FC = () => {
  const recent = useRecoilValue(projectListState);
  // TODO: Last Modified 順に並べなおす
  return (
    <Flex direction="vertical">
      {recent.map(({ name, path }, i) => (
        <ProjectItem key={i} name={`${i + 1}. ${name}`} path={path} />
      ))}
    </Flex>
  );
};

const ProjectItem: FC<{ name: string; path: string[] }> = ({ name, path }) => {
  const setRoute = useSetRecoilState(routeState);
  return (
    <TextButton
      style={{
        height: "30px",
        textAlign: "left",
        margin: "5px 0",
        padding: "0 5px",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
      onClick={() => setRoute({ page: "editor", project: path })}
    >
      {name}
    </TextButton>
  );
};
