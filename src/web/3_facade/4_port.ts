import { MouseEventHandler } from "react";
import { useRecoilState } from "recoil";
import { Port } from "~/web/1_type";
import { hwEditorFSM, useCreateWire } from "~/web/2_store";

export const usePort = (port: Port) => {
  // Global State
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const addWire = useCreateWire();

  // Calculate
  const onClick: MouseEventHandler = () => {
    if (fsm.state === "Default") {
      setState({
        state: "Wireing",
        value: { start: [port.object, port.name], startPos: port.pos, path: [] },
      });
    }
    if (fsm.state === "Wireing") {
      addWire({
        first: fsm.value.start,
        last: [port.object, port.name],
        firstPos: fsm.value.startPos,
        lastPos: port.pos,
        waypoints: fsm.value.path,
        width: 1,
      });
      setTimeout(() => setState({ state: "Default", value: {} })); // チャタリング防止（終点クリック時に新たな配線を始めてしまう）
    }
  };

  // Export
  return { onClick };
};
