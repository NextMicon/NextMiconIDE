import { selector } from "recoil";
import { posAdd, posFlip } from "~/utils";
import { Port } from "~/web/1_type";
import { instancesResolvedState } from "./1_instance";
import { ioportsResolvedState } from "./2_ioport";

export const portsState = selector<Port[]>({
  key: "ports",
  get: ({ get }) => {
    const instances = get(instancesResolvedState);
    const instancesPorts = instances.flatMap((instance) =>
      instance.pack.ports.map((port) => ({
        key: `${instance.name}/${port.name}`,
        object: instance.name,
        name: port.name,
        direct: port.direct,
        width: port.width,
        pos: posAdd(instance.pos, instance.flip ? posFlip(port.pos) : port.pos),
      })),
    );
    const ioPorts = get(ioportsResolvedState);
    const ioPortsPorts: Port[] = ioPorts.flatMap((ioPort) =>
      ioPort.pack.ports.map((port) => ({
        key: `${ioPort.name}/${port.name}`,
        object: ioPort.name,
        name: port.name,
        direct: port.direct,
        width: port.width,
        pos: posAdd(ioPort.pos, ioPort.flip ? posFlip(port.pos) : port.pos),
      })),
    );
    return [...instancesPorts, ...ioPortsPorts];
  },
});
