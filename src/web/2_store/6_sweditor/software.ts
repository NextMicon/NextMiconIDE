import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { SW_DIR, SW_FILE } from "~/consts";
import { useMessage } from "../0_sys/message";

interface TextFile {
  path: string[];
  text: string;
  uploading: boolean;
}

export const softwareFileState = atom<TextFile>({ key: "textFile" });

export const textRangeState = atom<{ from: number; to: number }>({ key: "selection", default: { from: 0, to: 0 } });

export const useOpenSoftware = () => {
  const setTextFile = useSetRecoilState(softwareFileState);
  const { createMessage } = useMessage();

  return async (path: string[]) => {
    window.log.info("openSoftware: Start");
    try {
      const filePath = [...path, SW_DIR, SW_FILE];
      const text = await window.ipc.fs.read(filePath);
      const textFile: TextFile = { path: filePath, text: text, uploading: false };
      setTextFile(textFile);
      window.log.info("openSoftware: Done");
    } catch (e) {
      window.log.error("openSoftware: Failed");
      window.log.error(e);
      createMessage("error", "Failed to open software", `${e}`);
    }
  };
};

export const useSoftwareEditor = () => {
  const [textFile, setTextFile] = useRecoilState(softwareFileState);
  const [textRange, setTextRange] = useRecoilState(textRangeState);

  const update = (text: string) => {
    setTextFile({ ...textFile, text: text });
  };

  const save = async () => {
    if (!textFile.uploading) {
      setTextFile({ ...textFile, uploading: true });
      await window.ipc.fs.write(textFile.path, textFile.text);
      setTextFile({ ...textFile, uploading: false });
    }
  };

  const insert = (snipet: string) => {
    update(textFile.text.slice(0, textRange.from) + snipet + textFile.text.slice(textRange.to));
  };

  return {
    path: textFile.path,
    value: textFile.text,
    uploading: textFile.uploading,
    update: update,
    save: save,
    textRange,
    setTextRange,
    insert,
  };
};
