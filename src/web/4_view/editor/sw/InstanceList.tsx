import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { CSSProperties, FC, Fragment, useState } from "react";
import { useRecoilValue } from "recoil";
import { Func } from "~/files";
import { Instance } from "~/web/1_type";
import { instancesResolvedState, useColor, useSoftwareEditor } from "~/web/2_store";
import { css } from "~/web/4_view/atom";

export const InstanceList = () => {
  const instances = useRecoilValue(instancesResolvedState);
  const color = useColor().editor.sw.pane;
  return (
    <div style={{ overflow: "scroll", background: color._.bg }}>
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
  const color = useColor().editor.sw.pane.inst;

  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const _color = hover ? color.hov : color._;

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
          background: _color.bg,
          color: _color.text,
        }}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ ...css.center }}>{open ? <KeyboardArrowDown style={iconCss} /> : <KeyboardArrowRight style={iconCss} />}</div>
        <div style={{ ...css.left, fontSize: SIZE - 10 }}>{instance.name}</div>
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
  const color = useColor().editor.sw.pane.func;
  const [hover, setHover] = useState(false);
  const { insert } = useSoftwareEditor();

  const use = `${inst}.${method.name}();`;
  const _color = hover ? color.hov : color._;

  const startWithLowercase = (str: string) => str.charAt(0) === str.charAt(0).toLowerCase();
  const typeColor = (str: string) => (startWithLowercase(str) ? _color.embtype : _color.objtype);

  return (
    <div
      style={{
        height: "auto",
        background: _color.bg,
        color: _color.text,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => insert(use)}
    >
      <div style={{ ...css.left, height: 20, whiteSpace: "nowrap" }}>
        <pre> </pre>
        <pre style={{ color: _color.comment }}>{note}</pre>
      </div>
      <div style={{ ...css.left, height: 20, whiteSpace: "nowrap" }}>
        <pre> </pre>
        <pre style={{ color: typeColor(method.type) }}>{method.type}</pre>
        <pre> </pre>
        <pre style={{ color: _color.funcname, fontWeight: "bold" }}>{method.name}</pre>
        <pre>(</pre>
        {method.args.map((arg, i, arr) => {
          const sep = i < arr.length - 1;
          return (
            <Fragment key={i}>
              <pre style={{ color: typeColor(arg.type) }}>{arg.type}</pre>
              <pre> </pre>
              <pre style={{ color: _color.varname }}>{arg.name}</pre>
              {sep && <pre>, </pre>}
            </Fragment>
          );
        })}
        <pre>);</pre>
      </div>
    </div>
  );
};
