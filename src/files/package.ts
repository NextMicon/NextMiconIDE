export interface Package {
  ports: {
    name: string;
    direct: "input" | "output" | "inout";
    width: number;
    pos: [number, number];
  }[];

  params: {
    name: string;
    valid: ({ type: "num"; num: number } | { type: "range"; from: number; to: number } | { type: "enum"; num: number; str: string })[];
  }[];

  size: [number, number];
  textX: number;

  software?: {
    className: string;
    memSize: number;
    methods: ({ note: string } & Func)[];
  };
}

export interface Func {
  type: string;
  name: string;
  args: { type: string; name: string }[];
}
