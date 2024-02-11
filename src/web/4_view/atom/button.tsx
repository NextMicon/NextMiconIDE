import { CSSProperties, Children, FC, ReactElement, ReactNode, cloneElement, useState } from "react";
import { useColor } from "~/web/2_store";

export const IconButton: FC<{
  size?: number;
  style?: CSSProperties;
  children?: ReactElement;
  onClick?: () => void;
  base?: string;
  highlight?: string;
  forceHover?: boolean;
}> = ({ size, style, children, onClick, base, highlight, forceHover }) => {
  const color = useColor();
  const [hover, setHover] = useState(false);
  const iconStyle = { color: "#CCCCCC", height: "80%", width: "80%" };
  const childs = Children.map(children, (child) =>
    child ? cloneElement(child, { style: { ...iconStyle, ...child.props.style } }) : undefined,
  );
  return (
    <button
      style={{
        padding: 0,
        // background: hover || forceHover ? highlight ?? color.gray.light : base ?? color.primary.light,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${size}px`,
        height: `${size}px`,
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
  style?: CSSProperties;
  children?: ReactNode;
  onClick?: () => void;
  base?: string;
  highlight?: string;
}> = ({ style, children, onClick, base, highlight }) => {
  const color = useColor();
  const [hover, setHover] = useState(false);
  return (
    <button
      style={{
        // background: hover ? highlight ?? color.gray.light : base ?? color.primary.light,
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
