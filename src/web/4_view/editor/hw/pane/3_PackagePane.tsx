import { ArrowDownward, Check, QuestionMark } from "@mui/icons-material";
import { CSSProperties, FC, useState } from "react";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { PackKey, packEq, packToString } from "~/web/1_type";
import { hwEditorFSM, localPacksState, useColor, useGetNewInstanceName } from "~/web/2_store";
import { IconButton, SearchBox, TextButton, layout } from "~/web/4_view/atom";

export const PackagePane: FC<{ style?: CSSProperties }> = ({ style }) => {
  const [keyword, setKeyword] = useState("");
  const color = useColor();
  return (
    <div style={{ ...layout.grid({ row: ["48px", "1fr"] }), background: color.hw_list.bg, userSelect: "none", ...style }}>
      <SearchBox
        text={keyword}
        setText={setKeyword}
        // TODO
        onSubmit={() => console.warn("Search Package:", keyword)}
        iconColor={color.toolbar.icon}
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
  const color = useColor();
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const selected = fsm.state === "AddInstance" && packEq(fsm.value.pack, pack);
  const [hover, setHover] = useState(false);
  const getNewName = useGetNewInstanceName();

  // TODO: this is random value
  const ready = pack.name.includes("O");

  return (
    <div
      style={{
        height: "30px",
        background: selected ? color.hw_list.item.selected : hover ? color.hw_list.item.hover : color.hw_list.item.normal,
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "20px 1fr 50px 30px 30px",
      }}
    >
      <div></div>
      <div
        style={{ height: "100%", display: "flex", alignItems: "center" }}
        onClick={() => {
          setState({ state: "AddInstance", value: { pack, name: getNewName(pack.name.toLocaleLowerCase()) } });
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {pack.name}
      </div>
      <TextButton style={{ margin: "5px 2px", ...layout.center }}>v0.0</TextButton>
      <IconButton style={{ margin: "2px" }}>{ready ? <Check /> : <ArrowDownward />}</IconButton>
      <IconButton style={{ margin: "2px" }} onClick={() => window.ipc.web.open("https://example.com")}>
        <QuestionMark />
      </IconButton>
    </div>
  );
};
