import { useRecoilValueLoadable } from "recoil";
import { softwareFileState, useSoftwareEditor } from "~/web/2_store";

import CodeMirror, { getStatistics, keymap } from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";

export const TextEditor = () => {
  const codeLoadable = useRecoilValueLoadable(softwareFileState);
  return (
    <>
      {codeLoadable.state === "loading" && <div>Loading</div>}
      {codeLoadable.state === "hasError" && <div>Error</div>}
      {codeLoadable.state === "hasValue" && <TextEditorBody />}
    </>
  );
};

const TextEditorBody = () => {
  const { value, update, save, textRange, setTextRange } = useSoftwareEditor();

  return (
    <CodeMirror
      value={value}
      height="100%"
      theme="dark"
      extensions={[
        cpp(),
        keymap.of([
          {
            key: "Ctrl-s",
            run: () => {
              save();
              return true;
            },
          },
        ]),
      ]}
      onChange={update}
      onUpdate={(s) => {
        const newRange = getStatistics(s).selection.ranges.at(0);
        if (newRange && newRange.from !== textRange.from && newRange.to !== textRange.to) {
          setTextRange({ from: newRange.from, to: newRange.to });
        }
      }}
    />
  );
};
