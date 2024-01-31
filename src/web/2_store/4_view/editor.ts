import { atom, useResetRecoilState } from "recoil";
import { Position } from "~/utils";

export const modeState = atom<"hardware" | "software">({ key: "mode", default: "hardware" });

export const hweditorSizesState = atom<number[]>({ key: "hweditorSizes", default: [] });
export const sweditorSizesState = atom<number[]>({ key: "sweditorSizes", default: [] });

export const svgOffsetStoreState = atom<Position>({ key: "svgOffsetStore", default: [0, 0] });
export const svgScaleStoreState = atom<number>({ key: "svgScaleStore", default: 1 });

export const runningState = atom<boolean>({ key: "running" });

export const useResetHweditorState = () => {
  const resetSvgOffset = useResetRecoilState(svgOffsetStoreState);
  const resetSvgScale = useResetRecoilState(svgScaleStoreState);
  return () => {
    resetSvgOffset();
    resetSvgScale();
  };
};
