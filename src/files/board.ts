export interface Board {
  templates: string[][];

  addr: {
    reserved: number;
    pageSize: number;
    maxAddr: number;
  };

  ioports: Record<string, string[]>;

  ioifs: {
    type: string;
    ports: {
      name: string;
      icon: "?" | "!" | undefined; // "<" | ">" | "<>"
      direct: "input" | "output" | "inout";
      width: number;
      pos: [number, number];
    }[];

    params: {
      name: string;
      valid: ({ type: "num"; num: number } | { type: "range"; from: number; to: number } | { type: "enum"; num: number; str: string })[];
    }[];

    size: [number, number];
  }[];
  tools: { name: string; cmd: string; inst: string }[];
  cmd: { name: string; src: string[]; out: string[]; cmd: string; arg: string[] }[];
}
