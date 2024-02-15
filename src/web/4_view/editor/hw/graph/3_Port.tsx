import { FC, useState } from "react";
import { Port } from "~/web/1_type";
import { useColor } from "~/web/2_store";
import { usePort } from "~/web/3_facade";

export const PortComponent: FC<{ port: Port }> = ({ port }) => {
  // Global State
  const { onClick } = usePort(port);
  const color = useColor().editor.hw.graph.obj;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [x, y] = port.pos;

  return (
    <g onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ cursor: "pointer" }}>
      {/* 表示 */}
      <circle cx={x} cy={y} r={hover ? 9 : 3} fill={color._.border} />
      {/* 当たり判定 */}
      <circle cx={x} cy={y} r={9} fillOpacity={0} />
    </g>
  );
};
