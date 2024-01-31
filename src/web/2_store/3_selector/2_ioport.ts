import { selector } from "recoil";
import { posAdd, posRound, posSub } from "~/utils";
import { Ioport, getIoportKey } from "~/web/1_type";
import { boardState, projectState } from "../2_project/0_project";
import { ioportIsSelected, selectedObjectsState } from "../4_actions/0_select";
import { hwEditorFSM, mousePositionState } from "../4_editor/0_fsm";

type IoportError = string;

const resolveAllIoports = selector({
  key: "resolveAllIoports",
  get: ({ get }) => {
    const { ioifs, ioports } = get(boardState);
    const { ioports: usedIoport } = get(projectState);
    return ioifs.map(({ type }) => {
      return Object.entries(ioports)
        .filter(([name, types]) => types.includes(type))
        .map(([name, _]) => name);
    });
  },
});

const ioportsResolveState = selector<({ type: "ioport"; value: Ioport } | { type: "error"; value: IoportError })[]>({
  key: "ioportsResolve",
  get: ({ get }) => {
    const { ioports } = get(projectState);
    const { ioifs } = get(boardState);
    const { state, value } = get(hwEditorFSM);
    const mousePosition = get(mousePositionState);
    const selectedObjects = get(selectedObjectsState);

    return ioports.map((ioport) => {
      const ioif = ioifs.find(({ type: name }) => name === ioport.type);
      if (ioif === undefined) {
        return { type: "error", value: `Undefined IOType: ${ioport.type} @ ioports.${ioport.name}` };
      }

      // Resolve Position if moving
      let pos = ioport.pos;
      if (state === "Moving" && ioportIsSelected(selectedObjects.ioports, getIoportKey(ioport))) {
        pos = posAdd(pos, posRound(posSub(mousePosition, value.start)));
      }

      return { type: "ioport", value: { ...ioport, pos, pack: ioif } };
    });
  },
});

export const ioportsResolvedState = selector<Ioport[]>({
  key: "ioportsResolved",
  get: ({ get }) => {
    const ioports = get(ioportsResolveState);
    return ioports.flatMap((ioport) => (ioport.type === "ioport" ? [ioport.value] : []));
  },
});

export const ioportsResolveErrrorState = selector<IoportError[]>({
  key: "ioportsResolveError",
  get: ({ get }) => {
    const ioports = get(ioportsResolveState);
    return ioports.flatMap((ioport) => (ioport.type === "error" ? [ioport.value] : []));
  },
});
