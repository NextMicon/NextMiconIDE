import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { SW_DIR, SW_FILE } from "~/consts";

interface TextFile {
  path: string[];
  text: string;
  uploading: boolean;
}

export const softwareFileState = atom<TextFile>({ key: "textFile" });

export const useOpenSoftware = () => {
  const setTextFile = useSetRecoilState(softwareFileState);
  return async (path: string[]) => {
    const filePath = [...path, SW_DIR, SW_FILE];
    const text = await window.ipc.fs.read(filePath);
    setTextFile({ path: filePath, text: text, uploading: false });
  };
};

export const useSoftwareEditor = () => {
  const [textFile, setTextFile] = useRecoilState(softwareFileState);

  const update = (text: string) => {
    console.log("Updated:", text);
    setTextFile({ ...textFile, text: text });
  };

  const save = async (text: string) => {
    setTextFile({ path: textFile.path, text: text, uploading: true });
    console.log("Save:", text);
    await window.ipc.fs.write(textFile.path, text);
    setTextFile({ path: textFile.path, text: text, uploading: false });
  };

  return { value: textFile.text, update: update, save: save };
};
