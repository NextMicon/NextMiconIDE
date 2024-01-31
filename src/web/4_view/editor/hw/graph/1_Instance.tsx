import { FC, useState } from "react";
import { Position, posAdd, posFlip } from "~/utils";
import { Instance, Pack } from "~/web/1_type";
import { useColor } from "~/web/2_store";
import { useInstance } from "~/web/3_facade";
import { LeftIcon, RightIcon } from "~/web/4_view/atom";

export const InstanceView: FC<{ instance: Instance }> = ({ instance }) => {
  // Global State
  const { onClick, onMouseDown, key, selected } = useInstance(instance);
  const color = useColor();

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [width, height] = instance.pack.size;
  const [ox, oy] = instance.pos;
  const ports = instance.pack.ports;
  const tx = instance.pack.textX;
  const highlight = selected ? selected : hover;

  return (
    <g
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      <rect
        x={ox - width / 2}
        y={oy - height / 2}
        width={width}
        height={height}
        stroke={color.primary.dark}
        strokeWidth={2}
        rx={20}
        fill={highlight ? color.primary.dark : color.primary.light}
      />
      <text x={instance.flip ? ox - tx : ox + tx} y={oy} fontSize={25} textAnchor="middle" alignmentBaseline="middle">
        {instance.name}
      </text>
      {ports.map((port) => (
        <PortInfo key={port.name} port={port} origin={instance.pos} hover={highlight} flip={instance.flip ?? false} />
      ))}
    </g>
  );
};

export const PackView: FC<{ pack: Pack; name: string; pos: Position }> = ({ pack, name, pos }) => {
  // Global State
  const color = useColor();

  // Local State
  // const [hover, setHover] = useState(false);

  // Calculate
  const [width, height] = pack.size;
  const [ox, oy] = pos;
  const ports = pack.ports;
  const tx = pack.textX;
  const highlight = true;

  return (
    <g style={{ cursor: "pointer" }}>
      <rect
        x={ox - width / 2}
        y={oy - height / 2}
        width={width}
        height={height}
        stroke={color.primary.dark}
        strokeWidth={2}
        rx={20}
        fill={highlight ? color.primary.dark : color.primary.light}
      />
      <text x={ox + tx} y={oy} fontSize={25} textAnchor="middle" alignmentBaseline="middle">
        {name}
      </text>
      {ports.map((port) => (
        <PortInfo key={port.name} port={port} origin={pos} hover={highlight} flip={false} />
      ))}
    </g>
  );
};

const PortInfo: FC<{ port: Pack["ports"][number]; origin: Position; hover: boolean; flip: boolean }> = ({ port, origin, hover, flip }) => {
  const textOffset = 35;
  const side = port.pos[0] > 0 !== flip;
  const color = useColor();
  const [x, y] = posAdd(origin, flip ? posFlip(port.pos) : port.pos);
  const io = port.direct === "input";
  const [cx, cy] = side ? [x - 18, y] : [x + 18, y];
  return (
    <>
      <circle cx={cx} cy={cy} r={14} fill={hover ? color.gray.mid : color.gray.light} />
      {side === io ? <LeftIcon cx={cx} cy={cy} color={color.primary.dark} /> : <RightIcon cx={cx} cy={cy} color={color.primary.dark} />}
      <text x={side ? x - textOffset : x + textOffset} y={y} fontSize={18} textAnchor={side ? "end" : "start"} alignmentBaseline="middle">
        {port.name}
      </text>
    </>
  );
};
