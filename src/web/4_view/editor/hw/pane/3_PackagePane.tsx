import { ArrowDownward, Check, QuestionMark } from "@mui/icons-material";
import { CSSProperties, FC, useState } from "react";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { PackKey, packEq, packToString } from "~/web/1_type";
import { hwEditorFSM, localPacksState, useColor, useGetNewInstanceName } from "~/web/2_store";
import { Grid, IconButton, SearchBox, TextButton, cssCenter } from "~/web/4_view/atom";

export const PackagePane: FC<{ style?: CSSProperties }> = ({ style }) => {
  const [keyword, setKeyword] = useState("");
  const color = useColor();
  return (
    <Grid row={["48px", "1fr"]} style={{ background: color.gray.mid, userSelect: "none", ...style }}>
      <SearchBox
        text={keyword}
        setText={setKeyword}
        // TODO
        onSubmit={() => console.warn("Search Package:", keyword)}
      />
      <PackageList />
    </Grid>
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
        background: selected ? color.primary.dark : hover ? color.primary.light : color.gray.mid,
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
      <TextButton style={{ margin: "5px 2px", ...cssCenter }}>v0.0</TextButton>
      <IconButton style={{ margin: "2px" }}>{ready ? <Check /> : <ArrowDownward />}</IconButton>
      <IconButton style={{ margin: "2px" }} onClick={() => window.ipc.web.open("https://example.com")}>
        <QuestionMark />
      </IconButton>
    </div>
  );
};
