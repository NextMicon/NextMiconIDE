import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { Project } from "~/files";
import { posRotX } from "~/utils";
import { InstanceKey, IoportKey, getInstanceKey, getIoportKey, instanceKeyEq, ioportKeyEq } from "~/web/1_type";
import { projectState } from "../2_project/0_project";
import { useRevert } from "../2_project/2_revert";
import { selectIsEmpty, selectedObjectsState } from "./0_select";

const flipInstance = (project: Project, key: InstanceKey, center?: number): Project => ({
  ...project,
  instances: project.instances.map((instance) =>
    instanceKeyEq(getInstanceKey(instance), key)
      ? { ...instance, flip: !instance.flip, pos: posRotX(instance.pos, center) }
      : instance,
  ),
});

const flipIoport = (project: Project, key: IoportKey, center?: number): Project => ({
  ...project,
  ioports: project.ioports.map((ioport) =>
    ioportKeyEq(getIoportKey(ioport), key)
      ? { ...ioport, flip: !ioport.flip, pos: posRotX(ioport.pos, center) }
      : ioport,
  ),
});

export const useFlip = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  const selectedObjects = useRecoilValue(selectedObjectsState);
  const resetSelect = useResetRecoilState(selectedObjectsState);
  return () => {
    if (!selectIsEmpty(selectedObjects)) {
      console.log("Flip", selectedObjects);

      //   // TODO: Calculate selected objects area
      //   const area = selectedObjects.reduce(
      //     (acc, cur) => {
      //       // const range = getRange(cur);
      //       return acc;
      //     },
      //     { min: [0, 0] as Position, max: [0, 0] as Position },
      //   );
      // const center = posRound(posMul(posSub(area.max, area.min), 1 / 2));

      let ret = project;
      ret = selectedObjects.instances.reduce((acc, key) => flipInstance(acc, key), ret);
      ret = selectedObjects.ioports.reduce((acc, key) => flipIoport(acc, key), ret);
      setProject(ret);
      commit();
    }
  };
};
