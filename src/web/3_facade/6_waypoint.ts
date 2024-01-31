import { MouseEventHandler } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { WaypointKey } from "../1_type";
import {
  hwEditorFSM,
  mousePositionState,
  useAppendWaypoint,
  useSelectWaypoint,
  useWaypointIsSelected,
} from "../2_store";

export const useWaypoint = (key: WaypointKey) => {
  // Global State
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const mousePosition = useRecoilValue(mousePositionState);
  const selectWaypoint = useSelectWaypoint();
  const appendWaypint = useAppendWaypoint();
  const selected = useWaypointIsSelected(key);

  // Calculate
  const select = () => selectWaypoint(key);
  const append = () => appendWaypint(key);
  const onMouseDown: MouseEventHandler = (e) => {
    if (fsm.state === "Default") {
      if (!selected) select();
      setState({ state: "Moving", value: { start: mousePosition } });
    }
  };
  const onClick: MouseEventHandler = (e) => {
    if (e.button === 0) {
      if (e.ctrlKey) append();
      else select();
    }
  };

  // Export
  return { selected, select, append, onMouseDown, onClick };
};
