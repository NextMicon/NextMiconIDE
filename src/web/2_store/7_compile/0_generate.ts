import { useRecoilValue } from "recoil";
import { boardPathState, boardState, projectPathState, projectState } from "../2_project/0_project";
import { instancesResolvedState } from "../3_selector/1_instance";
import { ioportsResolvedState } from "../3_selector/2_ioport";
import { wiresResolvedState } from "../3_selector/4_wire";
import { genReplace } from "./1_miconGen";

export const useGenerate = () => {
  const projectPath = useRecoilValue(projectPathState);
  const project = useRecoilValue(projectState);
  const boardPath = useRecoilValue(boardPathState);
  const board = useRecoilValue(boardState);
  const instances = useRecoilValue(instancesResolvedState);
  const ioports = useRecoilValue(ioportsResolvedState);
  const wires = useRecoilValue(wiresResolvedState);
  return async () => {
    console.log("Generating...");
    console.table(instances);
    const replaceList = genReplace(project, instances, ioports, wires);
    console.log(replaceList);

    // テンプレートを置換して生成
    await Promise.all(
      board.templates.map((fpaths) =>
        window.ipc.fs
          .read([...boardPath, ...fpaths])
          .then((tmplt) => replace(fpaths.join("/"), tmplt, replaceList))
          .then((out) => window.ipc.fs.write([...projectPath, ...fpaths], out)),
      ) ?? [],
    );
  };
};

const replace = (fname: string, template: string, replace_list: Record<string, string>) => {
  console.group();
  console.log(fname);
  const ret = Object.entries(replace_list).reduce(
    (prev, [tag, content]) => insert(prev, tag, `/* ${tag} */`, `/* end */`, content),
    template,
  );
  console.groupEnd();
  return ret;
};

const insert = (str: string, name: string, open_tag: string, close_tag: string, content: string) => {
  const open_idx = str.indexOf(open_tag);
  if (open_idx === -1) {
    console.log(`✗ ${name}`);
    return str;
  }
  const close_idx = str.indexOf(close_tag, open_idx);
  if (close_idx === -1) {
    console.log(`%c✗ ${name} - cannot find close tag`, "background: red; color: white");
    return str;
  }
  console.log(`%c✓ ${name}`, "background: green; color: white");
  return str.slice(0, open_idx + open_tag.length) + "\n" + content + "\n" + str.slice(close_idx);
};
