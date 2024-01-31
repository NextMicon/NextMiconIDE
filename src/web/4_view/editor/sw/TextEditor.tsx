import AceEditor from "react-ace";
import { useRecoilValueLoadable } from "recoil";
import { softwareFileState, useSoftwareEditor } from "~/web/2_store";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";

export const TextEditor = () => {
  const codeLoadable = useRecoilValueLoadable(softwareFileState);
  const { value, update, save } = useSoftwareEditor();
  return (
    <>
      {codeLoadable.state === "loading" && <div>Loading</div>}
      {codeLoadable.state === "hasError" && <div>Error</div>}
      {codeLoadable.state === "hasValue" && (
        <AceEditor
          height="100%"
          width="100%"
          mode="c_cpp"
          theme="monokai"
          fontSize="16px"
          highlightActiveLine={true}
          setOptions={{ tabSize: 2, printMargin: false, fontFamily: "Lucida Console" }}
          value={value}
          onChange={update}
          commands={[
            {
              name: "save",
              bindKey: { win: "Ctrl-s", mac: "Cmd-s" },
              exec: (s) => save(s.getValue()),
            },
          ]}
        />
      )}
    </>
  );
};
