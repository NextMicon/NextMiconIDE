import { FC, useState } from "react";
import { Position } from "~/utils";
import { Wire, getWaypointKey } from "~/web/1_type";
import { useColor } from "~/web/2_store";
import { useWaypoint, useWire } from "~/web/3_facade";

export const WireComponent: FC<{ wire: Wire }> = ({ wire }) => {
  // Global State
  const { selected, pathPoints, midPoints, startAddWaypoint, onClick, onDoubleClick, insertWaypoint } = useWire(wire);
  const color = useColor();

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const points = pathPoints.reduce((acc, [x, y]) => `${acc} ${x},${y}`, "");
  const highlight = selected || hover;

  return (
    <>
      <g
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ cursor: "pointer" }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points={points} stroke={color.wire.highlight} opacity={highlight ? 0.5 : 0} strokeWidth={12} />
        <polyline points={points} stroke={color.wire.normal} strokeWidth={3} />
        {midPoints.map((pos, i) => (
          <MidpointSVG key={i} wire={wire} idx={i} pos={pos} onMouseDown={() => startAddWaypoint(i)} />
        ))}
      </g>
      {wire.waypoints.map((pos, i) => (
        <WaypointSVG key={i} wire={wire} idx={i} pos={pos} />
      ))}
    </>
  );
};

const WaypointSVG: FC<{ wire: Wire; idx: number; pos: Position }> = ({ wire, idx, pos }) => {
  // Global State
  const color = useColor();
  const { selected, onClick, onMouseDown } = useWaypoint(getWaypointKey(wire, idx));

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [x, y] = pos;
  const highlight = selected ? selected : hover;

  return (
    <g
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}
    >
      <circle cx={x} cy={y} r={4} fillOpacity={highlight ? 1 : 0} fill={color.wire.normal} />
      <circle
        cx={x}
        cy={y}
        r={10}
        fillOpacity={highlight ? 0.3 : 0}
        fill={color.wire.normal}
        stroke={highlight ? color.wire.highlight : "none"}
      />
    </g>
  );
};

const MidpointSVG: FC<{ wire: Wire; idx: number; pos: Position; onMouseDown: () => void }> = ({ pos, onMouseDown }) => {
  // Global State
  const color = useColor();

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [x, y] = pos;

  return (
    <g onMouseDown={onMouseDown} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ cursor: "pointer" }}>
      <circle cx={x} cy={y} r={4} fillOpacity={hover ? 1 : 0} fill={color.wire.normal} />
      <circle
        cx={x}
        cy={y}
        r={10}
        fillOpacity={hover ? 0.3 : 0}
        fill={color.wire.normal}
        stroke={hover ? color.wire.highlight : "none"}
        strokeDasharray={"2 2"}
      />
    </g>
  );
};
