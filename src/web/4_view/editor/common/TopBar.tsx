import { ArrowRightAlt, DeviceHub, EditNote, Home, QuestionMark, Send, Settings } from "@mui/icons-material";
import { FC } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { URL_HELP } from "~/consts";
import { dialogState, routeState } from "~/web/2_route";
import { modeState, projectNameState, useColor, useGenerate, useRunMake } from "~/web/2_store";
import { Center, Grid, IconButton } from "~/web/4_view/atom";

export const TopBar: FC = () => {
  const color = useColor();
  const setRoute = useSetRecoilState(routeState);
  const setDialog = useSetRecoilState(dialogState);
  const projectName = useRecoilValue(projectNameState);
  const [mode, setMode] = useRecoilState(modeState);
  const runMake = useRunMake();
  const generate = useGenerate();
  return (
    <>
      <Grid column={["50px", "50px", "50px", "1fr", "50px", "50px", "50px", "50px"]} style={{ background: color.primary.dark }}>
        <Center>
          <IconButton size={40} onClick={() => setRoute({ page: "home" })}>
            <Home />
          </IconButton>
        </Center>
        <Center>
          <IconButton size={40} onClick={() => setDialog("setting")}>
            <Settings />
          </IconButton>
        </Center>
        <Center>
          <IconButton size={40} onClick={() => window.ipc.web.open(URL_HELP)}>
            <QuestionMark />
          </IconButton>
        </Center>
        <Center style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>{projectName}</Center>
        <Center>
          <IconButton size={40} onClick={() => setMode("hardware")} forceHover={mode === "hardware"}>
            <DeviceHub />
          </IconButton>
        </Center>
        <Center>
          <IconButton size={40} onClick={() => generate()}>
            <ArrowRightAlt />
          </IconButton>
        </Center>
        <Center>
          <IconButton size={40} onClick={() => setMode("software")} forceHover={mode === "software"}>
            <EditNote />
          </IconButton>
        </Center>
        <Center>
          <IconButton size={40} onClick={async () => runMake("upload")}>
            <Send />
          </IconButton>
        </Center>
      </Grid>
    </>
  );
};
