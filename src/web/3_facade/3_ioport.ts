import { MouseEventHandler } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Ioport, getIoportKey } from "~/web/1_type";
import { hwEditorFSM, mousePositionState, useAppendIoport, useIoportIsSelected, useRenameIoport, useSelectIoport } from "~/web/2_store";

export const useIoport = (ioport: Ioport) => {
  // Global State
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const mousePosition = useRecoilValue(mousePositionState);
  const selectIoport = useSelectIoport();
  const appendIoport = useAppendIoport();
  const renameIoport = useRenameIoport();

  // Calculate
  const key = getIoportKey(ioport);
  const selected = useIoportIsSelected(key);
  const select = () => selectIoport(key);
  const append = () => appendIoport(key);
  const rename = (newName: string) => renameIoport(ioport.name, newName);
  const onMouseDown: MouseEventHandler = () => {
    if (fsm.state === "Default") {
      if (!selected) select();
      setState({ state: "Moving", value: { start: mousePosition } });
    }
  };
  const onClick: MouseEventHandler = (e) => {
    if (fsm.state === "Default") {
      if (e.ctrlKey) append();
      else select();
    }
  };

  // Export
  return { selected, select, append, rename, onMouseDown, onClick };
};
