import { FC } from "react";
import { useRecoilValue } from "recoil";
import { Board } from "~/files";
import { Position, posRound } from "~/utils";
import { PackKey, packEq, packToString } from "~/web/1_type";
import {
  boardState,
  hwEditorFSM,
  instancesResolvedState,
  ioportsResolvedState,
  localPacksState,
  mousePositionState,
  portsState,
  useColor,
  wiresResolvedState,
} from "~/web/2_store";
import { Canvas } from "./0_Canvas";
import { InstanceView, PackView } from "./1_Instance";
import { IoifView, PrimitiveComponent } from "./2_Primitive";
import { PortComponent } from "./3_Port";
import { WireComponent } from "./4_Wire";

export const MiconEditor: FC<{}> = () => {
  const instances = useRecoilValue(instancesResolvedState);
  const ioPorts = useRecoilValue(ioportsResolvedState);
  const ports = useRecoilValue(portsState);
  const wires = useRecoilValue(wiresResolvedState);
  const fsm = useRecoilValue(hwEditorFSM);
  return (
    <Canvas>
      {fsm.state === "Selecting" && <SelectRect start={fsm.value.start} />}
      {ioPorts?.map((ioport) => <PrimitiveComponent key={ioport.name} prim={ioport} />)}
      {instances?.map((instance) => <InstanceView key={instance.name} instance={instance} />)}
      {fsm.state === "Wireing" && <ConnectingWire path={[fsm.value.startPos, ...fsm.value.path]} />}
      {wires?.map((wire, i) => <WireComponent key={i} wire={wire} />)}
      {ports?.map((port) => <PortComponent key={port.key} port={port} />)}
      {fsm.state === "AddInst" && <DummyInstance pack={fsm.value.mod} name={fsm.value.name} />}
      {fsm.state === "AddPrim" && <DummyIoport ioifName={fsm.value.type} ioName={fsm.value.name} />}
    </Canvas>
  );
};

const SelectRect: FC<{ start: Position; end?: Position }> = ({ start, end }) => {
  const mouse = useRecoilValue(mousePositionState);
  const [x1, y1] = start;
  const [x2, y2] = end ?? mouse;
  const [x, y] = [Math.min(x1, x2), Math.min(y1, y2)];
  const [width, height] = [Math.abs(x1 - x2), Math.abs(y1 - y2)];
  const color = useColor();
  return (
    <>
      <rect x={x} y={y} width={width} height={height} fill={color.editor.hw.graph.select.fill} opacity={0.3} />
      <rect x={x} y={y} width={width} height={height} fill="none" stroke={color.editor.hw.graph.select.stroke} strokeWidth={1} />
    </>
  );
};

const ConnectingWire: FC<{ path: Position[] }> = ({ path }) => {
  const mouse = useRecoilValue(mousePositionState);
  const color = useColor();
  const stickeyMouse = posRound(mouse);
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline
        points={[...path, stickeyMouse].map(([x, y]) => `${x},${y}`).reduce((p, c) => `${p} ${c}`, "")}
        stroke={color.editor.hw.graph.wire._}
        strokeWidth={3}
      />
    </g>
  );
};

const DummyInstance: FC<{ pack: PackKey; name: string }> = ({ pack, name }) => {
  // Global State
  const [x, y] = posRound(useRecoilValue(mousePositionState));
  const packs = useRecoilValue(localPacksState);
  const packResolved = packs.find((p) => packEq(pack, p));
  if (packResolved === undefined)
    return (
      <text x={x} y={y}>
        {`Unknown package: ${packToString(pack)}`}
      </text>
    );
  else return <PackView pack={packResolved} name={name} pos={[x, y]} />;
};

const DummyIoport: FC<{ ioifName: string; ioName: string }> = ({ ioifName, ioName }) => {
  const [x, y] = posRound(useRecoilValue(mousePositionState));
  const packs = useRecoilValue(localPacksState);
  const board = useRecoilValue(boardState);
  const ioif = board.ioifs.find(({ type }) => type === ioifName) as Board["ioifs"][number];
  if (ioif === undefined)
    return (
      <text x={x} y={y}>
        {`Unknown ioport: ${ioifName}`}
      </text>
    );
  else return <IoifView ioif={ioif} ioName={ioName} pos={[x, y]} flip={false} />;
};
