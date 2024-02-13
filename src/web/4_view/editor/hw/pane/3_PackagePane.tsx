import { ArrowDownward, Check, QuestionMark } from "@mui/icons-material";
import { CSSProperties, FC, useState } from "react";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { PackKey, packEq, packToString } from "~/web/1_type";
import { hwEditorFSM, localPacksState, useColor, useGetNewInstanceName } from "~/web/2_store";
import { IconButton, SearchBox, TextButton, css } from "~/web/4_view/atom";

export const PackagePane: FC<{ style?: CSSProperties }> = ({ style }) => {
  const [keyword, setKeyword] = useState("");
  const color = useColor().editor.hw.pane;
  return (
    <div style={{ ...css.rowGrid({ row: ["48px", "1fr"] }), background: color._.bg, userSelect: "none", ...style }}>
      <SearchBox
        text={keyword}
        setText={setKeyword}
        // TODO
        onSubmit={() => console.warn("Search Package:", keyword)}
        iconColor={color._.bg}
        inputColor={"white"}
      />
      <PackageList />
    </div>
  );
};

const PackageList = () => {
  const localPackListLodable = useRecoilValueLoadable(localPacksState);
  const loadingMessage = "Loading package list";
  const errorMessage = "Failed to load packages";
  return (
    <>
      {localPackListLodable.state === "loading" && <div>{loadingMessage}</div>}
      {localPackListLodable.state === "hasError" && <div>{errorMessage}</div>}
      {localPackListLodable.state === "hasValue" && (
        <div style={{ overflowY: "scroll" }}>
          {localPackListLodable.getValue().map((pack, i) => (
            <Package key={packToString(pack)} pack={pack} />
          ))}
        </div>
      )}
    </>
  );
};

const Package: FC<{ pack: PackKey }> = ({ pack }) => {
  // Global State
  const color = useColor().editor.hw.pane.item;
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const getNewName = useGetNewInstanceName();

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const selected = fsm.state === "AddInstance" && packEq(fsm.value.pack, pack);
  const _color = selected ? color.sel : hover ? color.hov : color._;

  // TODO: this is random value
  const ready = pack.name.includes("O");

  return (
    <div
      style={{
        ...css.colGrid({ column: [20, null, 30], row: 30 }),
        height: "auto",
        background: _color.bg,
        color: _color.text,
        cursor: "pointer",
        display: "grid",
      }}
    >
      <div></div>
      <div
        style={{ display: "flex", alignItems: "center" }}
        onClick={() => {
          setState({ state: "AddInstance", value: { pack, name: getNewName(pack.name.toLocaleLowerCase()) } });
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {pack.name}
      </div>
      {/* <TextButton color={color.btn} style={{ margin: "5px 2px", ...layout.center }}>
        v0.0
      </TextButton>
      <IconButton color={color.btn} style={{ margin: "2px" }}>
        {ready ? <Check /> : <ArrowDownward />}
      </IconButton> */}
      <IconButton color={color.btn} style={{ margin: "2px" }} onClick={() => window.ipc.web.open("https://example.com")}>
        <QuestionMark />
      </IconButton>
    </div>
  );
};
