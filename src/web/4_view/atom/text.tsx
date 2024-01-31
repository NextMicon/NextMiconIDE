import { SvgIconComponent } from "@mui/icons-material";
import { CSSProperties, FC, useState } from "react";
import { useColor } from "~/web/2_store";
import { Center, Left } from "./styling";

export const IconText: FC<{ text: string; Icon: SvgIconComponent; height: number; onClick?: () => void }> = ({
  text,
  Icon,
  height,
}) => {
  return (
    <div style={{ height: "auto", display: "grid", gridTemplateColumns: `${height}px 1fr` }}>
      <Center>
        <Icon style={{ height: `${height - 10}px`, width: `${height - 10}px` }} />
      </Center>
      <Left style={{ fontSize: `${height - 20}px` }}>{text}</Left>
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
        background: hover ? color.primary.light : color.gray.white,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Center>
        <Icon style={{ height: `${height - 10}px`, width: `${height - 10}px` }} />
      </Center>
      <Left style={{ fontSize: `${height - 20}px` }}>{text}</Left>
    </div>
  );
};
