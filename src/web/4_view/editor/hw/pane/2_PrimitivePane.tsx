import {
  ArrowBack,
  Code,
  DataArray,
  DataObject,
  HailSharp,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Numbers,
  Percent,
  PriorityHigh,
  SvgIconComponent,
} from "@mui/icons-material";
import { FC, ReactNode, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { boardState, hwEditorFSM, useAvailableIoports, useColor } from "~/web/2_store";
import { Center, IconText, Left, LeftIcon, css } from "~/web/4_view/atom";

const primitives = [
  { type: "in", nameSel: "select", Icon: KeyboardArrowRight },
  { type: "out", nameSel: "select", Icon: KeyboardArrowLeft },
  { type: "inout", nameSel: "select", Icon: Code },
  { type: "irq", nameSel: "select", Icon: PriorityHigh },
  { type: "in_reg", nameSel: "input", Icon: Numbers },
  { type: "out_reg", nameSel: "input", Icon: Numbers },
  // { type: "slice", nameSel: "none", Icon: DataArray },
  // { type: "concat", nameSel: "none", Icon: DataObject },
  // { type: "const", nameSel: "none", Icon: Percent },
] as { type: string; nameSel: "select" | "input" | "none"; Icon: SvgIconComponent }[];

export const PrimitivePane: FC = () => {
  const color = useColor().editor.hw.pane;

  return (
    <div style={{ overflowY: "scroll", background: color._.bg, color: color._.text }}>
      {primitives.map(({ type, Icon, nameSel }) => (
        <PrimitiveSelector key={type} type={type} nameSel={nameSel} Icon={Icon} />
      ))}
    </div>
  );
};

const PrimitiveSelector: FC<{ type: string; nameSel: "select" | "input" | "none"; Icon: SvgIconComponent }> = ({ type, nameSel, Icon }) => {
  // Global State
  const color = useColor().editor.hw.pane.item;
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const getAvailableIOPorts = useAvailableIoports();

  // Local State
  const [hover, setHover] = useState(false);
  const [name, setName] = useState("-");

  // Calculate
  const selected = fsm.state === "AddIoport" && fsm.value.type === type;
  const _color = selected ? color.sel : hover ? color.hov : color._;

  return (
    <div
      key={type}
      style={{
        ...css.colGrid({ column: [40, null, null], row: 40 }),
        height: "auto",
        background: _color.bg,
        color: _color.text,
        cursor: "pointer",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Center>
        <Icon style={{ height: 30, width: 30, color: _color.icon }} />
      </Center>
      <div style={{ ...css.left, fontSize: 20 }}>{type}</div>
      <div style={{ padding: 5 }}>
        {nameSel === "select" && (
          <select
            style={{ height: "100%", width: "100%" }}
            onChange={(e) => {
              setState({ state: "AddIoport", value: { type, name: e.target.value } });
            }}
          >
            <option>-</option>
            {getAvailableIOPorts(type).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
        {nameSel === "input" && <input style={{ height: "100%", width: "100%", boxSizing: "inherit" }} />}
      </div>
    </div>
  );
};

const Ioport: FC<{ type: string; name: string }> = ({ type, name }) => {
  const color = useColor().editor.hw.pane.item;
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const selected = fsm.state === "AddIoport" && fsm.value.type === type && fsm.value.name === name;
  const [hover, setHover] = useState(false);

  const _color = selected ? color.sel : hover ? color.hov : color._;

  return (
    <div
      style={{
        ...css.colGrid({ column: [20, null] }),
        height: "30px",
        background: _color.bg,
        color: _color.text,
        cursor: "pointer",
      }}
    >
      <div></div>
      <div
        style={css.left}
        onClick={() => {
          setState({ state: "AddIoport", value: { type, name } });
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {name}
      </div>
    </div>
  );
};
