export interface Project {
  board: {
    owner: string;
    name: string;
    version: string;
  };

  instances: {
    name: string;
    addr?: number;
    pack: { owner: string; name: string; version: string };
    params: [string, string | number][];
    pos: [number, number];
    flip?: boolean;
  }[];

  ioports: {
    name: string;
    assign?: string;
    type: string;
    params: [string, string | number][];
    pos: [number, number];
    flip?: boolean;
  }[];

  wires: {
    first: [string, string];
    last: [string, string];
    width: number;
    waypoints: [number, number][];
  }[];
}
