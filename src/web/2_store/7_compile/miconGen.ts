import { Project } from "~/files";
import { Instance, Primitive, Wire, eqPortKey, wireName } from "~/web/1_type";
import { cpp } from "./cppGen";
import { VInstance, VWire, verilog } from "./verilogGen";

// ------------------------------------------------------------------------------------------------
// 置換リスト

export const genReplace = (project: Project, instances: Instance[], ioports: Primitive[], wires: Wire[]): Record<string, string> => {
  return {
    includes: genIncludes(instances),
    declarations: genDeclarations(instances),
    definitions: genDefinitions(instances),
    iopin: genIOPort(ioports),
    iobuffer: genIOBuffer(ioports, wires),
    irq: genIRQ(ioports, wires),
    instances: genInstances(instances, wires),
    mem_ready: genMemReady(instances),
    mem_rdata: genMemRdata(instances),
  };
};

// ------------------------------------------------------------------------------------------------
// ファームウェア

// TODO 依存関係解決と重複除去

const genIncludes = (instances: Instance[]) => {
  const includes = instances
    .filter(({ addr }) => addr)
    .map(({ pack }) => cpp.include(`${pack.owner}/${pack.name}/${pack.version}/${pack.name}.hpp`));
  return includes.join("\n");
};

const genDeclarations = (instances: Instance[]) => {
  const declarations = instances.filter(({ addr }) => addr).map(({ name, pack }) => cpp.declaration(pack.name, name));
  return declarations.join("\n");
};

const genDefinitions = (instances: Instance[]) => {
  const instantiations = instances
    .filter(({ addr }) => addr)
    .map(({ name, pack, addr }) => cpp.instantiation(pack.name, name, `(volatile uint32_t*)0x${addr}00'0000`));
  return instantiations.join("\n");
};

// ------------------------------------------------------------------------------------------------
// ハードウェア

const genIOPort = (ioports: Primitive[]) => {
  return ioports
    .flatMap(({ name, pack }) => {
      switch (pack.type) {
        case "in":
          return [`    input  ${name}`];
        case "out":
          return [`    output ${name}`];
        case "inout":
          return [`    inout  ${name}`];
        default:
          return [];
      }
    })
    .join(",\n");
};

const genIOBuffer = (ioports: Primitive[], wires: Wire[]) => {
  return ioports
    .flatMap(({ name, pack }) => {
      if (pack.type === "inout") {
        // IOSEL に接続されているワイヤを探す
        const ioselWire = wires.find((wire) => eqPortKey(wire.last, [name, "iosel"]));
        if (!ioselWire) {
          console.error(`Open Port: ${name}.iosel`);
          return [];
        }
        // OUT に接続されているワイヤを探す
        const outWire = wires.find((wire) => eqPortKey(wire.last, [name, "out"]));
        if (!outWire) {
          console.error(`Open Port: ${name}.out`);
          return [];
        }
        // IN に接続されているワイヤを定義する
        const inWire = verilog.wire({ name: wireName([name, "in"]), width: 1 });
        // IOバッファの生成
        const iobuf = verilog.instance({
          module: "InOut",
          instance: `${name}_iobuf`,
          params: [],
          ioport: [
            { port: "pin", wire: name },
            { port: "iosel", wire: wireName(ioselWire.first) },
            { port: "out", wire: wireName(outWire.first) },
            { port: "in", wire: wireName([name, "in"]) },
          ],
        });
        return [iobuf, inWire];
      } else if (pack.type === "in") {
        // IN に接続されているワイヤを定義する
        const inWire = verilog.wire({ name: wireName([name, "in"]), width: 1 });
        // IOバッファの生成
        const iobuf = verilog.instance({
          module: "In",
          instance: `${name}_iobuf`,
          params: [],
          ioport: [
            { port: "pin", wire: name },
            { port: "in", wire: wireName([name, "in"]) },
          ],
        });
        return [iobuf, inWire];
      } else if (pack.type === "out") {
        // OUT に接続されているワイヤを探す
        const outWire = wires.find((wire) => eqPortKey(wire.last, [name, "out"]));
        if (!outWire) {
          console.error(`Open Port: ${name}.out`);
          return [];
        }
        // IO バッファの生成
        const iobuf = verilog.instance({
          module: "Out",
          instance: `${name}_iobuf`,
          params: [],
          ioport: [
            { port: "pin", wire: name },
            { port: "out", wire: wireName(outWire.first) },
          ],
        });
        return [iobuf];
      } else return [];
    })
    .join("\n");
};

const genIRQ = (ioports: Primitive[], wires: Wire[]) => {
  return ioports
    .flatMap(({ pack, name }) => {
      if (pack.type === "irq") {
        const irqWire = wires.find((wire) => eqPortKey(wire.last, [name, "irq"]));
        if (!irqWire) {
          console.error(`Open Port: ${name}.irq`);
          return [];
        }
        const irqNo = name.slice(3);
        return [`      irq[${irqNo}] = ${wireName(irqWire.first)};`];
      } else return [];
    })
    .join("\n");
};

const genInstances = (instances: Instance[], wires: Wire[]) => {
  return instances
    .map(({ name, addr, pack, params }) => {
      let vwires: VWire[] = [];
      let vinst: VInstance = {
        instance: name,
        module: pack.name,
        // Basic Connections
        ioport: [
          { port: "clk", wire: "clk" },
          { port: "resetn", wire: "resetn" },
        ],
        params: params.map(([k, v]) => ({ param: k, val: `${v}` })),
      };

      // Memory Map Connections
      if (addr) {
        vinst.ioport = [
          ...vinst.ioport,
          { port: "valid", wire: `${name}_valid` },
          { port: "ready", wire: `${name}_ready` },
          { port: "wstrb", wire: `${name}_valid ? mem_wstrb : 4'b0` },
          { port: "addr", wire: "mem_addr" },
          { port: "wdata", wire: "mem_wdata" },
          { port: "rdata", wire: `${name}_rdata` },
        ];
        vwires = [
          ...vwires,
          { name: `${name}_sel`, width: 1, init: `mem_addr[31:24] == 8'h${addr}` },
          { name: `${name}_valid`, width: 1, init: `mem_valid && ${name}_sel` },
          { name: `${name}_ready`, width: 1 },
          { name: `${name}_rdata`, width: 32 },
        ];
      }

      // IO Connections
      pack.ports.forEach((port) => {
        if (port.direct === "input") {
          const wire = wires.find(({ last: to }) => eqPortKey(to, [name, port.name]));
          if (wire) {
            vinst.ioport = [...vinst.ioport, { port: port.name, wire: wireName(wire.first) }];
            return;
          }
          if (!wire) {
            console.log(`Open port: ${name}.${port.name}`);
            vinst.ioport = [...vinst.ioport, { port: port.name, wire: verilog.const({ width: port.width, value: 0 }) }];
            return;
          }
        }

        if (port.direct === "output") {
          const wire = wires.find(({ first: from }) => eqPortKey(from, [name, port.name]));
          if (wire) {
            const typeCheck = wire.width == port.width;
            if (typeCheck) {
              vwires = [...vwires, { name: wireName([name, port.name]), width: port.width }];
              vinst.ioport = [...vinst.ioport, { port: port.name, wire: wireName([name, port.name]) }];
              return;
            } else {
              console.log(`Invalid width: ${name}.${port.name}`);
              return;
            }
          }
          if (!wire) {
            console.log(`Open port: ${name}.${port.name}`);
            return;
          }
        }
      });

      return [verilog.instance(vinst), ...vwires.map(verilog.wire)].join("\n");
    })
    .join("\n\n");
};

const genMemReady = (instances: Instance[]) =>
  instances
    .filter(({ pack }) => pack.software)
    .map(({ name }) => `, ${name}_ready`)
    .join("");

const genMemRdata = (instances: Instance[]) =>
  instances
    .filter(({ pack }) => pack.software)
    .map(({ name }) => `: ${name}_ready ? ${name}_rdata`)
    .join("");
