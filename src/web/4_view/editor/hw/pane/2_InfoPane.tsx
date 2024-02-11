import {
  Apps,
  ArrowRightAlt,
  Check,
  Close,
  CommitSharp,
  DeveloperBoard,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  Timeline,
} from "@mui/icons-material";
import { FC, useState } from "react";
import { useRecoilValue } from "recoil";
import { Instance, Ioport, Wire, getWireKeyStr } from "~/web/1_type";
import {
  boardState,
  instancesResolvedState,
  ioportsResolvedState,
  projectState,
  useAvailableIoports,
  useColor,
  wiresResolvedState,
} from "~/web/2_store";
import { useInstance, useIoport, useWire } from "~/web/3_facade";
import { Center, IconButton, IconText, Left, layout } from "~/web/4_view/atom";

export const InfoPane: FC = () => {
  return (
    <div>
      <IconText Icon={DeveloperBoard} height={40} text={"Board"} />
      <BoardInfo />
      <IconText Icon={Apps} height={40} text={"Instances"} />
      {/* <InstanceList /> */}
      <IconText Icon={CommitSharp} height={40} text={"IOPort"} />
      {/* <IoportList /> */}
      <IconText Icon={Timeline} height={40} text={"Wire"} />
      {/* <WireList /> */}
    </div>
  );
};

const BoardInfo: FC = () => {
  // Global State
  const proj = useRecoilValue(projectState);
  const board = useRecoilValue(boardState);
  const color = useColor();
  const [detail, setDetail] = useState(false);
  return (
    <>
      <div
        style={{
          ...layout.grid({ column: ["20px", "1fr", "1fr", "30px"] }),
          height: "30px",
          cursor: "pointer",
        }}
      >
        <div></div>
        <Left>{proj.board.name}</Left>
        <Left>{proj.board.version}</Left>
        <IconButton color={color.editor.hw.list.item} style={{ margin: "2px" }} onClick={() => setDetail(!detail)}>
          {detail ? <KeyboardArrowDown /> : <KeyboardArrowLeft />}
        </IconButton>
      </div>
      {detail && (
        <div style={{ height: "auto" }}>
          <pre>{JSON.stringify(board, undefined, 2)}</pre>
        </div>
      )}
    </>
  );
};

const InstanceList: FC = () => {
  const instances = useRecoilValue(instancesResolvedState);
  return (
    <>
      {instances.map((inst, i) => (
        <InstanceListItem key={inst.name} instance={inst} />
      ))}
    </>
  );
};

const InstanceListItem: FC<{ instance: Instance }> = ({ instance }) => {
  // Global State
  const { selected, select, append, rename } = useInstance(instance);
  const color = useColor();

  // Local State
  const [detail, setDetail] = useState(false);
  const [hover, setHover] = useState(false);
  const [newName, setNewName] = useState(instance.name);

  // Calculate
  const background = selected ? color.hw_list.item.selected : hover ? color.hw_list.item.hover : color.hw_list.item.normal;
  const submitRename = () => {
    if (newName !== instance.name) rename(newName);
  };

  return (
    <>
      <div
        style={{ ...layout.grid({ column: ["20px", "1fr", "1fr", "30px"] }), height: "30px", cursor: "pointer", background }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => (e.ctrlKey ? append() : select())}
      >
        <div></div>
        <Left>{instance.pack.name}</Left>
        <Left>{instance.name}</Left>
        <IconButton style={{ margin: "2px" }} onClick={() => setDetail(!detail)}>
          {detail ? <KeyboardArrowDown /> : <KeyboardArrowLeft />}
        </IconButton>
      </div>
      {detail && (
        <div style={{ height: "auto" }}>
          <div style={{ ...layout.grid({ column: ["40px", "1fr", "1fr", "30px"] }), height: "30px" }}>
            <div></div>
            <Left>{"name"}</Left>
            <input
              style={{ display: "block", width: "100%", height: "100%" }}
              onChange={(e) => setNewName(e.target.value)}
              value={newName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitRename();
                }
              }}
            />
            <IconButton style={{ margin: "2px" }} onClick={submitRename}>
              <Check />
            </IconButton>
          </div>
          {/* <pre>{JSON.stringify(instance, undefined, 2)}</pre> */}
        </div>
      )}
    </>
  );
};

const IoportList: FC = () => {
  const ioports = useRecoilValue(ioportsResolvedState);
  return (
    <>
      {ioports.map((ioport, i) => {
        return <IoportListItem key={ioport.name} ioport={ioport} />;
      })}
    </>
  );
};

const IoportListItem: FC<{ ioport: Ioport }> = ({ ioport }) => {
  // Global State
  const color = useColor();
  const { selected, append, select, rename } = useIoport(ioport);
  const avalable = useAvailableIoports()(ioport.pack.type);

  // Local State
  const [detail, setDetail] = useState(false);
  const [hover, setHover] = useState(false);
  const [newName, setNewName] = useState(ioport.name);

  // Calculate
  const background = selected ? color.hw_list.item.selected : hover ? color.hw_list.item.hover : color.hw_list.item.normal;
  const submitRename = () => {
    if (newName !== ioport.name) rename(newName);
  };

  return (
    <>
      <div
        style={{ ...layout.grid({ column: ["20px", "1fr", "1fr", "30px"] }), height: "30px", cursor: "pointer", background }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => (e.ctrlKey ? append() : select())}
      >
        <div></div>
        <Left>{ioport.pack.type}</Left>
        <Left>{ioport.name}</Left>
        <IconButton style={{ margin: "2px" }} onClick={() => setDetail(!detail)}>
          {detail ? <KeyboardArrowDown /> : <KeyboardArrowLeft />}
        </IconButton>
      </div>
      {detail && (
        <div style={{ ...layout.grid({ column: ["40px", "1fr", "1fr"] }), height: "30px" }}>
          <div></div>
          <Left>{"name"}</Left>
          <select
            onChange={(e) => {
              // if (e.target.value!==) {
              // }
            }}
          ></select>
          {/* <input style={{ display: "block", width: "100%", height: "100%" }} onChange={(e) => setNewName(e.target.value)} value={newName} /> */}
        </div>
      )}
    </>
  );
};

const EdditableText: FC<{ text: string; onChange: (text: string) => void }> = ({ text, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState(text);
  return editing ? (
    <div style={layout.grid({ column: ["1fr", "30px", "30px"] })}>
      <input type={"text"} value={newText} onChange={(e) => setNewText(e.target.value)}></input>
      <IconButton
        style={{ margin: "2px" }}
        onClick={() => {
          onChange(newText);
          setEditing(false);
        }}
      >
        <Check />
      </IconButton>
      <IconButton style={{ margin: "2px" }} onClick={() => setEditing(false)}>
        <Close />
      </IconButton>
    </div>
  ) : (
    <div style={layout.left} onClick={() => setEditing(true)}>
      {text}
    </div>
  );
};

const SellectableText: FC<{ text: string; options: string[]; onChange: (text: string) => void }> = ({ text, options, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState(text);
  return editing ? (
    <div>
      <select onChange={(e) => setNewText(e.target.value)}>
        {options.map((s, i) => (
          <option key={i}>{s}</option>
        ))}
      </select>
      <button
        onClick={() => {
          onChange(newText);
          setEditing(false);
        }}
      >
        Rename
      </button>
      <button onClick={() => setEditing(false)}>Cancel</button>
    </div>
  ) : (
    <div onClick={() => setEditing(true)}>{text}</div>
  );
};

const WireList: FC = () => {
  const wires = useRecoilValue(wiresResolvedState);

  return (
    <>
      {wires.map((wire) => (
        <WireListItem key={getWireKeyStr(wire)} wire={wire} />
      ))}
    </>
  );
};

const WireListItem: FC<{ wire: Wire }> = ({ wire }) => {
  // Global State
  const color = useColor();
  const { selected, append, select } = useWire(wire);

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const background = selected ? color.hw_list.item.selected : hover ? color.hw_list.item.hover : color.hw_list.item.normal;

  return (
    <div
      style={{
        ...layout.grid({ column: ["20px", "2fr", "20px", "40px", "2fr"] }),
        height: "30px",
        cursor: "pointer",
        background,
        whiteSpace: "nowrap",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => (e.ctrlKey ? append() : select())}
    >
      <div></div>
      <Left>{wire.first.join(".")}</Left>
      <Center>{wire.width}</Center>
      <Left>
        <ArrowRightAlt />
      </Left>
      <Left>{wire.last.join(".")}</Left>
    </div>
  );
};
