import { DeviceHub, EditNote, Handyman, Home, Language, Send, Settings } from "@mui/icons-material";
import { FC } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { URL_NEXT_MICON } from "~/consts";
import { dialogState, routeState } from "~/web/2_route";
import { modeState, projectNameState, useColor, useGenerate, useRunMake } from "~/web/2_store";
import { Center, IconButton, layout } from "~/web/4_view/atom";

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
      <div
        style={{
          ...layout.colGrid({ column: [50, 50, 50, null, 50, 50, 50, 50] }),
          background: color.editor.toolbar._.bg,
          color: color.editor.toolbar._.text,
        }}
      >
        <Center>
          <IconButton color={color.editor.toolbar.btn} size={40} onClick={() => setRoute({ page: "home" })}>
            <Home />
          </IconButton>
        </Center>
        <Center>
          <IconButton color={color.editor.toolbar.btn} size={40} onClick={() => setDialog("setting")}>
            <Settings />
          </IconButton>
        </Center>
        <Center>
          <IconButton color={color.editor.toolbar.btn} size={40} onClick={() => window.ipc.web.open(URL_NEXT_MICON)}>
            <Language />
          </IconButton>
        </Center>
        <div style={{ ...layout.center, color: color.editor.toolbar._.text, fontWeight: "bold", fontSize: "20px" }}>{projectName}</div>
        <Center>
          <IconButton color={color.editor.toolbar.btn} size={40} onClick={() => setMode("hardware")}>
            <DeviceHub />
          </IconButton>
        </Center>

        <Center>
          <IconButton color={color.editor.toolbar.btn} size={40} onClick={() => setMode("software")}>
            <EditNote />
          </IconButton>
        </Center>
        <Center>
          <IconButton color={color.editor.toolbar.btn} size={40} onClick={async () => runMake("upload")}>
            <Send />
          </IconButton>
        </Center>
        <Center>
          <IconButton color={color.editor.toolbar.btn} size={40} onClick={() => setDialog("build")}>
            <Handyman />
          </IconButton>
        </Center>
      </div>
    </>
  );
};
