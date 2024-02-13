import { CSSProperties, Children, FC, ReactElement, ReactNode, cloneElement, useState } from "react";
import { Center, css } from "./0_styling";
import { SvgIconComponent } from "@mui/icons-material";

export const IconButton: FC<{
  color: { _: { bg: string; icon: string }; hov: { bg: string; icon: string } };
  size?: number;
  style?: CSSProperties;
  children?: ReactElement;
  onClick?: () => void;
}> = ({ color, size, style, children, onClick }) => {
  const [hover, setHover] = useState(false);
  const childs = Children.map(children, (child) =>
    child ? cloneElement(child, { style: { height: "80%", width: "80%", ...child.props.style } }) : undefined,
  );
  return (
    <button
      style={{
        background: hover ? color.hov.bg : color._.bg,
        color: hover ? color.hov.icon : color._.icon,

        ...css.center,

        width: size,
        height: size,
        padding: 0,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",

        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {childs}
    </button>
  );
};

export const TextButton: FC<{
  color: { _: { bg: string; text: string }; hov: { bg: string; text: string } };
  style?: CSSProperties;
  children?: ReactNode;
  onClick?: () => void;
  base?: string;
  highlight?: string;
}> = ({ color, style, children, onClick, base, highlight }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      style={{
        background: hover ? color.hov.bg : color._.bg,
        color: hover ? color.hov.text : color._.text,
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
};

export const IconText: FC<{
  color: { bg: string; icon: string; text: string };
  text: string;
  Icon: SvgIconComponent;
  height: number;
}> = ({ color, text, Icon, height }) => {
  return (
    <div style={{ ...css.colGrid({ column: [height, null] }), height: "auto", background: color.bg }}>
      <Center>
        <Icon style={{ height: height - 10, width: height - 10, color: color.icon }} />
      </Center>
      <div style={{ ...css.left, fontSize: height - 20, color: color.text }}>{text}</div>
    </div>
  );
};

export const IconTextButton: FC<{
  color: { bg: string; icon: string; text: string };
  text: string;
  Icon: SvgIconComponent;
  height: number;
  onClick?: () => void;
}> = ({ color, text, Icon, height, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{ ...css.colGrid({ column: [height, null] }), height: "auto", background: color.bg, cursor: "pointer" }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={css.center}>
        <Icon style={{ height: `${height - 10}px`, width: `${height - 10}px` }} />
      </div>
      <div style={{ ...css.left, fontSize: `${height - 20}px` }}>{text}</div>
    </div>
  );
};
