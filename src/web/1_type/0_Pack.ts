import { Package } from "~/files";

export interface Pack extends Package {
  owner: string;
  name: string;
  version: string;
}

export interface PackKey {
  owner: string;
  name: string;
  version: string;
}

export const packToString = (pack: PackKey) => `${pack.owner}/${pack.name}/${pack.version}`;
export const packEq = (lhs: PackKey, rhs: PackKey) => lhs.owner === rhs.owner && lhs.name === rhs.name && lhs.version === rhs.version;
