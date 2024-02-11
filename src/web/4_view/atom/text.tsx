import { SvgIconComponent } from "@mui/icons-material";
import { CSSProperties, FC, useState } from "react";
import { useColor } from "~/web/2_store";
import { layout } from "./styling";

export const IconText: FC<{
  color: { bg: string; icon: string; text: string };
  text: string;
  Icon: SvgIconComponent;
  height: number;
  onClick?: () => void;
}> = ({ color, text, Icon, height }) => {
  return (
    <div style={{ height: "auto", display: "grid", gridTemplateColumns: `${height}px 1fr`, background: color.bg }}>
      <div style={layout.center}>
        <Icon style={{ height: `${height - 10}px`, width: `${height - 10}px`, color: color.icon }} />
      </div>
      <div style={{ ...layout.left, fontSize: `${height - 20}px`, color: color.text }}>{text}</div>
    </div>
  );
};

export const IconTextButton: FC<{
  text: string;
  Icon: SvgIconComponent;
  height: number;
  style?: CSSProperties;
  onClick?: () => void;
}> = ({ text, Icon, height, style, onClick }) => {
  const [hover, setHover] = useState(false);
  const color = useColor();
  return (
    <div
      style={{
        height: "auto",
        display: "grid",
        gridTemplateColumns: `${height}px 1fr`,
        cursor: "pointer",
        // background: hover ? color.primary.light : color.gray.white,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={layout.center}>
        <Icon style={{ height: `${height - 10}px`, width: `${height - 10}px` }} />
      </div>
      <div style={{ ...layout.left, fontSize: `${height - 20}px` }}>{text}</div>
    </div>
  );
};
