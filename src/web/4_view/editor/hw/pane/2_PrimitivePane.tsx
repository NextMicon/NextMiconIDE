import { FC, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { boardState, hwEditorFSM, useAvailableIoports, useColor } from "~/web/2_store";
import { Accordion, layout } from "~/web/4_view/atom";

export const PrimitivePane: FC = () => {
  const color = useColor().editor.hw.pane;
  const board = useRecoilValue(boardState);
  const getAvailableIOPorts = useAvailableIoports();
  return (
    <div style={{ overflowY: "scroll", background: color._.bg, color: color._.text }}>
      {board.ioifs.map(({ type }) => (
        <Accordion color={color.headder._} key={type} title={type}>
          {getAvailableIOPorts(type).map((name) => (
            <Ioport key={name} type={type} name={name} />
          ))}
        </Accordion>
      ))}
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
        ...layout.colGrid({ column: [20, null] }),
        height: "30px",
        background: _color.bg,
        color: _color.text,
        cursor: "pointer",
      }}
    >
      <div></div>
      <div
        style={layout.left}
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
