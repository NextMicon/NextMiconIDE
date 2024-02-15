import { ArrowDownward, Check, QuestionMark } from "@mui/icons-material";
import { CSSProperties, FC, useState } from "react";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { PackKey, packEq, packToString } from "~/web/1_type";
import { hwEditorFSM, localPacksState, useColor, useGetNewInstanceName } from "~/web/2_store";
import { IconButton, SearchBox, css } from "~/web/4_view/atom";

export const ModPane: FC<{ style?: CSSProperties }> = ({ style }) => {
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
      <ModList />
    </div>
  );
};

const ModList = () => {
  const localPackListLodable = useRecoilValueLoadable(localPacksState);
  const loadingMessage = "Loading package list";
  const errorMessage = "Failed to load packages";
  return (
    <>
      {localPackListLodable.state === "loading" && <div>{loadingMessage}</div>}
      {localPackListLodable.state === "hasError" && <div>{errorMessage}</div>}
      {localPackListLodable.state === "hasValue" && (
        <div style={{ ...css.colGrid({ column: [20, null, 30], row: 30 }), height: "auto" }}>
          {localPackListLodable.getValue().map((pack, i) => (
            <ModItem key={packToString(pack)} pack={pack} />
          ))}
        </div>
      )}
    </>
  );
};

const ModItem: FC<{ pack: PackKey }> = ({ pack }) => {
  // Global State
  const color = useColor().editor.hw.pane.item;
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const getNewName = useGetNewInstanceName();

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const selected = fsm.state === "AddInst" && packEq(fsm.value.mod, pack);
  const _color = selected ? color.sel : hover ? color.hov : color._;

  // TODO: this is random value
  const ready = pack.name.includes("O");

  return (
    <div style={{ ...css.colSubGrid, background: _color.bg, color: _color.text, cursor: "pointer" }}>
      <div></div>
      <div
        style={{ display: "flex", alignItems: "center" }}
        onClick={() => {
          setState({ state: "AddInst", value: { mod: pack, name: getNewName(pack.name.toLocaleLowerCase()) } });
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {pack.name}
      </div>
      <IconButton color={color.btn} style={{ margin: "2px" }} onClick={() => window.ipc.web.open("https://example.com")}>
        <QuestionMark />
      </IconButton>
    </div>
  );
};
