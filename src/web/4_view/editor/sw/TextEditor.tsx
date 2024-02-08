import { useRecoilValueLoadable } from "recoil";
import { softwareFileState, useSoftwareEditor } from "~/web/2_store";

import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";
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

const cursorTheme = EditorView.theme({});

const TextEditorBody = () => {
  const { path, value, update, save } = useSoftwareEditor();
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme="dark"
      extensions={[
        cpp(),
        cursorTheme,
        keymap.of([
          {
            key: "Ctrl-s",
            run: (e) => {
              save();
              return true;
            },
          },
        ]),
      ]}
      onChange={update}
    />
  );
};
