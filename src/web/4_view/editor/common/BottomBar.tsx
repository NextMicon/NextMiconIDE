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
        background: color.editor.toolbar._.bg,
        color: color.editor.toolbar._.text,
      }}
    >
      {rootdir.join("/").replaceAll("///", "/")}
    </div>
  );
};
