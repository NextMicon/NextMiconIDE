import {
  AccessTime,
  Code,
  DataArray,
  DataObject,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Numbers,
  Percent,
  PriorityHigh,
  SvgIconComponent,
} from "@mui/icons-material";
import { FC, useState } from "react";
import { useRecoilState } from "recoil";
import { hwEditorFSM, useAvailableIoports, useColor } from "~/web/2_store";
import { Center, css } from "~/web/4_view/atom";

const primitives = [
  { type: "in", nameSel: "select", Icon: KeyboardArrowRight },
  { type: "out", nameSel: "select", Icon: KeyboardArrowLeft },
  { type: "inout", nameSel: "select", Icon: Code },
  { type: "irq", nameSel: "select", Icon: PriorityHigh },
  // { type: "in_reg", nameSel: "none", Icon: Numbers },
  // { type: "out_reg", nameSel: "none", Icon: Numbers },
  // { type: "clk", nameSel: "none", Icon: AccessTime },
  // { type: "slice", nameSel: "none", Icon: DataArray },
  // { type: "concat", nameSel: "none", Icon: DataObject },
  // { type: "const", nameSel: "none", Icon: Percent },
  // { type: "verilog", nameSel: "none", Icon: Code },
] as { type: string; nameSel: "select" | "input" | "none"; Icon: SvgIconComponent }[];

export const PrimPane: FC = () => {
  const color = useColor().editor.hw.pane._;
  return (
    <div style={{ ...css.colGrid({ column: [40, null, null], row: 40 }), overflowY: "scroll", background: color.bg, color: color.text }}>
      {primitives.map(({ type, Icon, nameSel }) => (
        <PrimItem key={type} type={type} nameSel={nameSel} Icon={Icon} />
      ))}
    </div>
  );
};

const PrimItem: FC<{ type: string; nameSel: "select" | "input" | "none"; Icon: SvgIconComponent }> = ({ type, nameSel, Icon }) => {
  // Global State
  const color = useColor().editor.hw.pane.item;
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const getAvailableIOPorts = useAvailableIoports();

  // Local State
  const [hover, setHover] = useState(false);
  const NULL_NAME = "-";
  const [name, setName] = useState(NULL_NAME);

  // Calculate
  const available = getAvailableIOPorts(type);
  const selected = fsm.state === "AddPrim" && fsm.value.type === type;
  const _color = selected ? color.sel : hover ? color.hov : color._;

  return (
    <div
      key={type}
      style={{ ...css.colSubGrid, cursor: "pointer", background: _color.bg, color: _color.text }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (name !== NULL_NAME) setState({ state: "AddPrim", value: { type, name: name } });
      }}
    >
      <Center>
        <Icon style={{ height: 30, width: 30, color: _color.icon }} />
      </Center>
      <div style={{ ...css.left, fontSize: 20 }}>{type}</div>
      <div style={{ padding: 5 }}>
        {nameSel === "select" && (
          <select
            style={{ height: "100%", width: "100%", cursor: "pointer" }}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value !== NULL_NAME) {
                setState({ state: "AddPrim", value: { type, name: e.target.value } });
              }
            }}
            value={name}
          >
            <option>{NULL_NAME}</option>
            {available.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
        {nameSel === "input" && <input style={{ height: "100%", width: "100%", boxSizing: "inherit" }} />}
      </div>
    </div>
  );
};
