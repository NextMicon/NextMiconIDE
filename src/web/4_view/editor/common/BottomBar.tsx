import { useRecoilValue } from "recoil";
import { projectPathState, useColor } from "~/web/2_store";

export const BottomBar = () => {
  const color = useColor();
  const rootdir = useRecoilValue(projectPathState);
  return <div style={{ background: color.primary.dark, color: color.gray.light }}>{rootdir.join("/").replaceAll("///", "/")}</div>;
};
