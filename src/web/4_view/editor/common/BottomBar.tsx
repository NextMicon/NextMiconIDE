import { useRecoilValue } from "recoil";
import { projectPathState, useColor } from "~/web/2_store";
import { layout } from "../../atom";

export const BottomBar = () => {
  const color = useColor();
  const rootdir = useRecoilValue(projectPathState);
  return (
    <div
      style={{
        ...layout.left,
        background: color.toolbar.bg,
        color: color.toolbar.text,
      }}
    >
      {rootdir.join("/").replaceAll("///", "/")}
    </div>
  );
};
