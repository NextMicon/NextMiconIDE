export type Registory = RegistoryItem[];

export interface RegistoryItem {
  owner: string;
  pack: string;
  version: string;
  description: string;
  keywords: string[];
}
