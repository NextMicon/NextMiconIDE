import { FC, useState } from "react";
import { Board } from "~/files";
import { Position, posAdd, posFlip, posSub } from "~/utils";
import { Ioport } from "~/web/1_type";
import { useColor } from "~/web/2_store";
import { useIoport } from "~/web/3_facade";
import { ExclamationIcon, LeftIcon, QuestionIcon, RightIcon } from "~/web/4_view/atom";

export const IoportComponent: FC<{ ioport: Ioport }> = ({ ioport }) => {
  // Global State
  const { selected, onClick, onMouseDown } = useIoport(ioport);
  const color = useColor();

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [width, height] = posSub(ioport.pack.size, [0, 4]);
  const [ox, oy] = ioport.pos;
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
        rx={18}
        fill={highlight ? color.primary.dark : color.primary.light}
      />
      <text
        x={ioport.flip ? ox - width / 2 + 40 : ox + width / 2 - 40}
        y={oy}
        fontSize={22}
        textAnchor={ioport.flip ? "start" : "end"}
        alignmentBaseline="middle"
      >
        {ioport.name}
      </text>
      {ioport.pack.ports.map((port) => (
        <IOPortBg key={port.name} port={port} flip={ioport.flip ?? false} hover={highlight} origin={ioport.pos} />
      ))}
      {ioport.pack.ports.map((port) => (
        <IOPortIcon key={port.name} port={port} flip={ioport.flip ?? false} hover={highlight} origin={ioport.pos} />
      ))}
    </g>
  );
};

export const IoifView: FC<{ ioif: Board["ioifs"][number]; ioName: string; pos: Position; flip: boolean }> = ({
  ioif,
  ioName,
  pos,
  flip,
}) => {
  // Global State
  const color = useColor();

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [width, height] = posSub(ioif.size, [0, 4]);
  const [ox, oy] = pos;
  const highlight = true;

  return (
    <g onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ cursor: "pointer" }}>
      <rect
        x={ox - width / 2}
        y={oy - height / 2}
        width={width}
        height={height}
        stroke={color.primary.dark}
        strokeWidth={2}
        rx={18}
        fill={highlight ? color.primary.dark : color.primary.light}
      />
      <text
        x={flip ? ox - width / 2 + 40 : ox + width / 2 - 40}
        y={oy}
        fontSize={22}
        textAnchor={flip ? "start" : "end"}
        alignmentBaseline="middle"
      >
        {ioName}
      </text>
      {ioif.ports.map((port) => (
        <IOPortBg key={port.name} port={port} flip={flip} hover={highlight} origin={pos} />
      ))}
      {ioif.ports.map((port) => (
        <IOPortIcon key={port.name} port={port} flip={flip} hover={highlight} origin={pos} />
      ))}
    </g>
  );
};

const IOPortBg: FC<{
  port: Board["ioifs"][number]["ports"][number];
  origin: Position;
  hover: boolean;
  flip: boolean;
}> = ({ port, origin, hover, flip }) => {
  const side = port.pos[0] > 0 !== flip;
  const color = useColor();
  const [x, y] = posAdd(origin, flip ? posFlip(port.pos) : port.pos);
  const [cx, cy] = side ? [x - 18, y] : [x + 18, y];
  return <circle cx={cx} cy={cy} r={14} fill={hover ? color.gray.mid : color.gray.light} />;
};

const IOPortIcon: FC<{
  port: Board["ioifs"][number]["ports"][number];
  origin: Position;
  hover: boolean;
  flip: boolean;
}> = ({ port, origin, hover, flip }) => {
  const side = port.pos[0] > 0 !== flip;
  const color = useColor();
  const [x, y] = posAdd(origin, flip ? posFlip(port.pos) : port.pos);
  const io = port.direct === "input";
  const [cx, cy] = side ? [x - 18, y] : [x + 18, y];
  const icon = port.icon;
  return (
    <>
      {/* <circle cx={cx} cy={cy} r={14} fill={hover ? color.gray.mid : color.gray.light} /> */}
      {icon === "!" && <ExclamationIcon cx={cx} cy={cy} color={color.primary.dark} />}
      {icon === "?" && <QuestionIcon cx={cx} cy={cy} color={color.primary.dark} />}
      {icon === undefined &&
        (side === io ? <LeftIcon cx={cx} cy={cy} color={color.primary.dark} /> : <RightIcon cx={cx} cy={cy} color={color.primary.dark} />)}
    </>
  );
};
