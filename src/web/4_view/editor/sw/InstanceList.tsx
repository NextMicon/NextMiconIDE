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
    <div style={{ overflow: "scroll", backgroundColor: color.gray.black, color: color.gray.white }}>
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
          background: hover ? color.primary.dark : color.gray.black,
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
          {instance.pack.software?.member.map(({ doc, copy }, i) => (
            <Method key={i} doc={doc} copy={copy.replace("${INSTANCE}", instance.name)} />
          ))}
        </div>
      )}
    </div>
  );
};

const Method: FC<{ doc: string; copy: string }> = ({ doc, copy }) => {
  const color = useColor();
  const [hover, setHover] = useState(false);

  const SIZE = 30;
  const TAB = 40;

  return (
    <div
      style={{
        height: SIZE,
        background: hover ? color.primary.dark : color.gray.black,
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: `${TAB}px 1fr`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => window.ipc.clipboard.copy(copy)}
    >
      <div style={{ ...cssCenter }}>{/* <HorizontalRule style={{ height: 15, width: 15 }} /> */}</div>
      <div style={{ ...cssLeft, whiteSpace: "nowrap" }}>{doc}</div>
      {/* <Left style={{ whiteSpace: "nowrap", overflow: "hidden", padding: "0 5px" }}>{doc}</Left> */}
    </div>
  );
};
