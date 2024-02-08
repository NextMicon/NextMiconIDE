import { useRecoilValue } from "recoil";
import { projectPathState, useColor } from "~/web/2_store";
import { cssLeft } from "../../atom";

export const BottomBar = () => {
  const color = useColor();
  const rootdir = useRecoilValue(projectPathState);
  return (
    <div style={{ ...cssLeft, background: color.primary.dark, color: color.gray.light }}>{rootdir.join("/").replaceAll("///", "/")}</div>
  );
};
