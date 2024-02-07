import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { CSSProperties, FC, useState } from "react";
import { useRecoilValue } from "recoil";
import { Instance } from "~/web/1_type";
import { instancesResolvedState, useColor } from "~/web/2_store";
import { cssCenter, cssLeft } from "~/web/4_view/atom";

export const InstanceList = () => {
  const instances = useRecoilValue(instancesResolvedState);
  const color = useColor();
  return (
    <div style={{ overflow: "scroll", backgroundColor: "#272822", color: color.gray.white }}>
      <div
        style={{
          height: "auto",
          display: "flex",
          flexDirection: "column",
          userSelect: "none",
        }}
      >
        {instances
          .filter(({ pack }) => pack.software)
          .toSorted((lhs, rhs) => (lhs.name > rhs.name ? 1 : -1))
          .map((instance) => (
            <InstanceDoc key={instance.name} instance={instance} />
          ))}
      </div>
    </div>
  );
};

const InstanceDoc: FC<{ instance: Instance }> = ({ instance }) => {
  const color = useColor();

  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const SIZE = 30;
  const iconCss: CSSProperties = { height: `${SIZE}px`, width: `${SIZE}px` };

  return (
    <div style={{ height: "auto", overflow: "hidden" }}>
      <div
        style={{
          height: SIZE,
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: `${SIZE}px 1fr`,
          background: hover ? color.primary.dark : "#272822",
        }}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ ...cssCenter }}>{open ? <KeyboardArrowDown style={iconCss} /> : <KeyboardArrowRight style={iconCss} />}</div>
        <div style={{ ...cssLeft, fontSize: SIZE - 10 }}>{instance.name}</div>
      </div>
      {open && (
        <div>
          {instance.pack.software?.member.map(({ note, use, def }, i) => (
            <Method key={i} note={note} def={def} use={use.replace("${INSTANCE}", instance.name)} />
          ))}
        </div>
      )}
    </div>
  );
};

const Method: FC<{ note: string; def: string; use: string }> = ({ note, def, use }) => {
  const color = useColor();
  const [hover, setHover] = useState(false);

  const SIZE = 30 * 2;
  const TAB = 40;

  return (
    <div
      style={{
        height: SIZE,
        background: hover ? color.primary.dark : "#272822",
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: `${TAB}px 1fr`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => window.ipc.clipboard.copy(use)}
    >
      <div></div>
      <div style={{ ...cssLeft, whiteSpace: "nowrap" }}>{note}</div>
      <div></div>
      <div style={{ ...cssLeft, whiteSpace: "nowrap" }}>{def}</div>
    </div>
  );
};
