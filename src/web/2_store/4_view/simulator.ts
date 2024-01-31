import { atom } from "recoil";

type Change = { time: number; wire: string; val: number };

// シミュレーションに渡すテストベンチの設定

// シミュレーションの実行と結果

export const simuState = atom<"halt" | "simulating" | "done">({ key: "simuState", default: "halt" });

export const simuResult = atom<Change[]>({ key: "simuResult", default: [] });

// シミュレーション結果の再生

export const playTick = atom<number>({ key: "playTick", default: 0 });

// playTick における各変数（ワイヤ、レジスタ）の値
// ファサードで各オブジェクトと結合する
// export const currentWireValue = selector

// プレイヤーの状態
// 再生速度 tick / frame
export const playSpeed = atom<number>({ key: "playSpeed", default: 1 });
// タイムラインのオブジェクト
export const playObjects = atom<string[]>({ key: "playObjects", default: [] });
