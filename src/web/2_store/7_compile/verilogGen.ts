const toHex = (n: number) => "0x" + n.toString(16).toUpperCase();

// Verilog Nodes
export interface VInstance {
  module: string;
  instance: string;
  params: { param: string; val: string }[];
  ioport: { port: string; wire: string }[];
}

export interface VWire {
  name: string;
  width: number;
  init?: string;
}

interface VAssign {
  from: string;
  to: string;
}

interface VConst {
  width: number;
  value: number;
}

export const verilog = {
  module: () => {},
  instance: ({ module, ioport, params, instance }: VInstance) => {
    // パラメタ
    let paramStr = " ";
    if (params.length !== 0) {
      paramStr = `#(\n${params.map(({ param: key, val }) => `      .${key}(${val})`).join(",\n")}\n)`;
    }
    // IOポートの接続
    let connectStr = " ";
    if (ioport.length !== 0) {
      connectStr = ` (\n${ioport.map(({ port, wire }) => `      .${port}(${wire})`).join(",\n")}\n  )`;
    }
    return `  ${module}${paramStr}${instance}${connectStr};`;
  },
  wire: ({ name, width, init }: VWire) => `  wire ${width === 1 ? "" : `[${width - 1}:0] `}${name}${init ? ` = ${init}` : ""};`,
  assign: (to: string, from: string) => `  assign ${to} = ${from};`,
  const: ({ width, value }: VConst) => `${width}'d${value}`,
};

interface MemEntry {
  name: string;
  addr: string;
}

export const micon = {
  ioports: (ioports: { dir: "in" | "out" | "inout"; name: string }[]) => ioports.map(({ dir, name }) => `${dir} ${name}`).join(",\n"),
  irqs: (irqs: { no: number; wire: string }[]) => irqs.map(({ no, wire }) => `    irq[${no}] = ${wire};`).join("\n"),
  mem_ready: (mem: MemEntry[]) => mem.map(({ name }) => name).join(","),
  mem_rdata: (mem: MemEntry[]) => mem.map(({ name }) => `: ${name}_ready ? ${name}_rdata`).join("\n"),
};
