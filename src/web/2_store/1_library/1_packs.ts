import { load } from "js-yaml";
import { selector, useRecoilValue } from "recoil";
import { PACK_DIR, PACK_FILE, REGISTORY_FILE, URL_PACK_REPO } from "~/consts";
import { Package, RegistoryItem } from "~/files";
import { Pack } from "~/web/1_type";
import { pathState } from "../0_sys/directory";
import { flatten } from "./util";

// --------------------------------------------------------------------------------
// ローカルパッケージ一覧

export const localPackListState = selector({
  key: "localPackList",
  get: async ({ get }) => {
    const { home, pack } = get(pathState);
    try {
      const tree = await window.ipc.fs.tree([...home, PACK_DIR]);
      const packPathsList = flatten(tree).flatMap(({ path }) => {
        const [pack_dir, owner, name, version, pack_file] = path.split("/").slice(-5);
        const ok = pack_dir === PACK_DIR && pack_file === PACK_FILE;
        return ok ? [{ owner, name, version }] : [];
      });
      return packPathsList;
    } catch (e) {
      window.log.error(`Failed to search libraries in "${PACK_DIR}" directory`);
      window.log.error(e);
      throw e;
    }
  },
});

// --------------------------------------------------------------------------------
// ローカルパッケージの実体

export const localPacksState = selector({
  key: "localPacks",
  get: async ({ get }) => {
    const { home } = get(pathState);
    const localPackList = get(localPackListState);
    try {
      const packs = await Promise.all(
        localPackList.map(async ({ owner, name, version }) => {
          const packFile = await window.ipc.fs
            .read([...home, PACK_DIR, owner, name, version, PACK_FILE])
            .then((str) => load(str) as Package);
          return { ...packFile, owner, name, version } as Pack;
        }),
      );
      return packs;
    } catch (e) {
      window.log.error(`Failed to search libraries in "${PACK_DIR}" directory`);
      window.log.error(e);
      throw e;
    }
  },
});

// --------------------------------------------------------------------------------
// レジストリのパッケージの一覧

export const registoryPackListState = selector({
  key: "registoryPackList",
  get: async ({ get }) => {
    const { home } = get(pathState);
    const regFilePaths = [...home, PACK_DIR, REGISTORY_FILE];
    try {
      return await window.ipc.fs
        .read(regFilePaths)
        .then((str) => load(str) as RegistoryItem[])
        .catch((e) =>
          window.ipc.web
            .clone([URL_PACK_REPO, REGISTORY_FILE], [...home, PACK_DIR, REGISTORY_FILE])
            .then((str) => load(str) as RegistoryItem[]),
        );
    } catch (e) {
      await window.log.error(`Failed: "${regFilePaths.join("/")}"`);
      window.log.error(e);
      throw e;
    }
  },
});

// レジストリファイルの更新
export const useUpdateRegistory = () => {
  const { home } = useRecoilValue(pathState);
  return async () => {
    await window.ipc.web.clone([URL_PACK_REPO, REGISTORY_FILE], [...home, PACK_DIR, REGISTORY_FILE]);
  };
};

// --------------------------------------------------------------------------------
// ローカルとレジストリを比較したパッケージ一覧

interface PackInfo {
  owner: string;
  name: string;
  version: string;
  keywords: string[];
  description: string;

  local: boolean;
  remote: boolean;
}

export const mergedPackList = selector({
  key: "mergedPackList",
  get: ({ get }) => {
    const local = get(localPackListState);
    const registory = get(registoryPackListState);

    // merge local & registory
    let ret: PackInfo[] = [];
    registory.forEach((pack) => {
      ret = [
        ...ret,
        {
          owner: pack.owner,
          name: pack.pack,
          version: pack.version,
          keywords: pack.keywords,
          description: pack.description,
          local: false,
          remote: true,
        },
      ];
    });

    local.forEach((pack) => {
      let search = ret.find((p) => p.owner === pack.owner && p.name === pack.name && p.version === pack.version);
      if (search) search.local = true;
      else
        ret = [
          ...ret,
          { owner: pack.owner, name: pack.name, version: pack.version, keywords: [], description: "", local: true, remote: false },
        ];
    });

    ret = ret.sort((lhs, rhs) => (`${lhs.owner}/${lhs.name}/${lhs.version}` > `${rhs.owner}/${rhs.name}/${rhs.version}` ? 1 : -1));

    return ret;
  },
});

// --------------------------------------------------------------------------------
// パッケージをダウンロード

export const useDownloadPackage = () => {
  const { home } = useRecoilValue(pathState);
  return async (pack: PackInfo) => {
    const path = [pack.owner, pack.name, pack.version];
    const files = [PACK_FILE, `${pack.name}.cpp`, `${pack.name}.hpp`, `${pack.name}.sv`];
    await window.ipc.fs.mkdir([...home, PACK_DIR, ...path]);
    await Promise.all(files.map((file) => window.ipc.web.clone([URL_PACK_REPO, ...path, file], [...home, PACK_DIR, ...path, file])));
  };
};
