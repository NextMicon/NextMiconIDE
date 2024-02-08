import { useRecoilValueLoadable } from "recoil";
import { softwareFileState, useSoftwareEditor } from "~/web/2_store";
import { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "@codemirror/basic-setup";

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
  const { path, value, update, save } = useSoftwareEditor();
  const editorParentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorParentRef.current === null) return;
    const state = EditorState.create({ doc: value });
    const editorView = new EditorView({
      state,
      parent: editorParentRef.current,
    });
    return () => {
      editorView.destroy();
    };
  }, [editorParentRef]);

  return <div ref={editorParentRef} />;
};
