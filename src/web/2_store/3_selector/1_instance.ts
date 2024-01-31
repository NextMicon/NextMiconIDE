import { selector } from "recoil";
import { posAdd, posRound, posSub } from "~/utils";
import { Instance, getInstanceKey, packEq, packToString } from "~/web/1_type";
import {
  boardState,
  hwEditorFSM,
  instanceIsSelected,
  localPacksState,
  mousePositionState,
  projectState,
  selectedObjectsState,
} from "~/web/2_store";

type InstanceError = string;

const instancesResolveState = selector<({ type: "instance"; value: Instance } | { type: "error"; value: InstanceError })[]>({
  key: "instanceResolve",
  get: ({ get }) => {
    const project = get(projectState);
    const packs = get(localPacksState);
    const board = get(boardState);
    const { state, value } = get(hwEditorFSM);
    const mousePosition = get(mousePositionState);
    const selectedObjects = get(selectedObjectsState);

    let addrAccumulator = Math.ceil(board.addr.reserved / board.addr.pageSize);

    return project.instances.map((instance) => {
      // Resolve Package
      const pack = packs.find((pack) => packEq(pack, instance.pack));
      if (pack === undefined) {
        return { type: "error", value: `Cannot find package: ${packToString(instance.pack)} @ instances.${instance.name}` };
      }

      // Resolve Address
      let addr: number | undefined = undefined;
      if (pack.software) {
        addr = addrAccumulator;
        addrAccumulator += Math.ceil(pack.software.memSize / board.addr.pageSize);
      }

      // Resolve Position if moving
      let pos = instance.pos;
      if (state === "Moving" && instanceIsSelected(selectedObjects.instances, getInstanceKey(instance))) {
        pos = posAdd(pos, posRound(posSub(mousePosition, value.start)));
      }

      const ret: Instance = { ...instance, pack, addr, pos };

      return { type: "instance", value: ret };
    });
  },
});

export const instancesResolvedState = selector<Instance[]>({
  key: "instancesResolved",
  get: ({ get }) => {
    const instances = get(instancesResolveState);
    return instances.flatMap((inst) => (inst.type === "instance" ? [inst.value] : []));
  },
});

export const instancesResolveErrorState = selector<InstanceError[]>({
  key: "instancesResolvedError",
  get: ({ get }) => {
    const instances = get(instancesResolveState);
    return instances.flatMap((inst) => (inst.type === "error" ? [inst.value] : []));
  },
});
