import { Allotment } from "allotment";
import { useRecoilState } from "recoil";
import { sweditorSizesState } from "~/web/2_store";
import { InstanceList } from "./InstanceList";
import { TextEditor } from "./TextEditor";

export const SWeditor = () => {
  const [sizes, setSizes] = useRecoilState(sweditorSizesState);

  return (
    <Allotment onChange={setSizes} defaultSizes={sizes}>
      <Allotment.Pane preferredSize={400} minSize={100}>
        <InstanceList />
      </Allotment.Pane>
      <Allotment.Pane>
        <TextEditor />
      </Allotment.Pane>
    </Allotment>
  );
};
