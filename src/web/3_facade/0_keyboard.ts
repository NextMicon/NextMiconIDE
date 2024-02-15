import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  hwEditorFSM,
  paneState,
  selectedObjectsState,
  useCopy,
  useDelete,
  useFlip,
  usePaste,
  useRevert,
  useSaveProject,
} from "~/web/2_store";

export const useHWEditorFacade = () => {
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const resetSelectedObjects = useResetRecoilState(selectedObjectsState);
  const save = useSaveProject();
  const { undo, redo } = useRevert();
  const copy = useCopy();
  const paste = usePaste();
  const del = useDelete();
  const flip = useFlip();
  const setPane = useSetRecoilState(paneState);

  const keyboard = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setState({ state: "Default", value: {} });
      resetSelectedObjects();
    }
    if (e.ctrlKey && e.key === "d") del();
    if (e.ctrlKey && e.key === "c") copy();
    if (e.ctrlKey && e.key === "v") paste();
    if (e.ctrlKey && e.key === "f") flip();
    if (e.ctrlKey && e.key === "z") undo();
    if (e.ctrlKey && e.key === "y") redo();
    if (e.ctrlKey && e.key === "s") save();
    if (e.ctrlKey && e.key === "1") setPane({ type: "info" });
    if (e.ctrlKey && e.key === "2") setPane({ type: "primitive" });
    if (e.ctrlKey && e.key === "3") setPane({ type: "pack" });
  };
  return { keyboard };
};
