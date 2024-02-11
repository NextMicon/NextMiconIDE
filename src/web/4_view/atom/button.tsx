import { CSSProperties, Children, FC, ReactElement, ReactNode, cloneElement, useState } from "react";
import { useColor } from "~/web/2_store";
import { layout } from "./styling";

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

        ...layout.center,

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
