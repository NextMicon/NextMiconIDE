import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { CSSProperties, FC, Fragment, useState } from "react";
import { useRecoilValue } from "recoil";
import { COLORS } from "~/consts";
import { Func, Package } from "~/files";
import { Instance } from "~/web/1_type";
import { instancesResolvedState, useColor } from "~/web/2_store";
import { cssCenter, cssLeft } from "~/web/4_view/atom";

export const InstanceList = () => {
  const instances = useRecoilValue(instancesResolvedState);
  const color = useColor();
  return (
    <div style={{ overflow: "scroll", backgroundColor: COLORS.bg, color: color.gray.white }}>
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
          background: hover ? color.primary.dark : COLORS.bg,
        }}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ ...cssCenter }}>{open ? <KeyboardArrowDown style={iconCss} /> : <KeyboardArrowRight style={iconCss} />}</div>
        <div style={{ ...cssLeft, fontSize: SIZE - 10 }}>{instance.name}</div>
      </div>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
          {instance.pack.software?.methods.map((method, i) => <Func key={i} inst={instance.name} note={method.note} method={method} />)}
        </div>
      )}
    </div>
  );
};

const Func: FC<{ inst: string; note: string; method: Func }> = ({ inst, note, method }) => {
  const color = useColor();
  const [hover, setHover] = useState(false);

  const use = `${inst}.${method.name}();`;

  const ccolor = {
    comment: "#6a9955",
    embtype: "#569cd6",
    objtype: "#4ec9b0",
    funcname: "#dcdcaa",
    varname: "#9cdcfe",
  } as const;

  const startWithLowercase = (str: string) => {
    return str.charAt(0) === str.charAt(0).toLowerCase();
  };
  const typeColor = (str: string) => {
    return startWithLowercase(str) ? ccolor.embtype : ccolor.objtype;
  };

  return (
    <div
      style={{
        height: "auto",
        background: hover ? color.primary.dark : COLORS.bg,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => window.ipc.clipboard.copy(use)}
    >
      <div style={{ ...cssLeft, height: 20, whiteSpace: "nowrap" }}>
        <pre> </pre>
        <pre style={{ color: ccolor.comment }}>{note}</pre>
      </div>
      <div style={{ ...cssLeft, height: 20, whiteSpace: "nowrap" }}>
        <pre> </pre>
        <pre style={{ color: typeColor(method.type) }}>{method.type}</pre>
        <pre> </pre>
        <pre style={{ color: ccolor.funcname, fontWeight: "bold" }}>{method.name}</pre>
        <pre>(</pre>
        {method.args.map((arg, i, arr) => {
          const sep = i < arr.length - 1;
          return (
            <Fragment key={i}>
              <pre style={{ color: typeColor(arg.type) }}>{arg.type}</pre>
              <pre> </pre>
              <pre style={{ color: ccolor.varname }}>{arg.name}</pre>
              {sep && <pre>, </pre>}
            </Fragment>
          );
        })}
        <pre>);</pre>
      </div>
    </div>
  );
};
