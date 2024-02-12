import { useRecoilValue } from "recoil";
import { dialogState, routeState } from "../2_route";
import { Layer } from "./atom";
import { BoardDialog, BuildDialog, CreateProjectDialog, MessageList, PackageDialog, SettingDialog } from "./dialog";
import { Editor } from "./editor/Editor";
import { Home } from "./home/Home";

export const App = () => {
  const route = useRecoilValue(routeState);
  const dialog = useRecoilValue(dialogState);

  return (
    <>
      {/* Page */}
      {route.page === "home" && <Home />}
      {route.page === "editor" && <Editor projectPath={route.project} />}

      {/* Dialogs */}
      {dialog === "createProject" && <CreateProjectDialog zIndex={40} />}
      {dialog === "setting" && <SettingDialog zIndex={40} />}
      {dialog === "package" && <PackageDialog zIndex={40} />}
      {dialog === "board" && <BoardDialog zIndex={40} />}
      {dialog === "build" && <BuildDialog zIndex={40} />}
      <Layer zIndex={41}>
        <MessageList />
      </Layer>
    </>
  );
};
