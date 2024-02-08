import { useRecoilValue } from "recoil";
import { useMessage } from "../0_sys/message";
import { projectPathState } from "../2_project/0_project";

const useRunPath = (cmd: string, arg: string[], srcFiles: string[][], distFiles: string[][]) => {};

export const useRunMake = () => {
  const projpath = useRecoilValue(projectPathState);
  const { createMessage: createDialog, deleteMessage: deleteDialog } = useMessage();
  return async (target = "test") => {
    const cmd = `make ${target}`;
    const runningDialog = createDialog("info", cmd);
    try {
      const result = await window.ipc.run.execa("make", target ? [target] : [], projpath, {});
      deleteDialog(runningDialog);
      if (result.exitCode === 0) {
        createDialog("info", `${cmd}: Done`, result.stdout);
      } else {
        createDialog("error", `${cmd}: Error`, result.stderr);
      }
    } catch (e) {
      createDialog("error", `${cmd}: Error`, `${e}`);
    }
  };
};
