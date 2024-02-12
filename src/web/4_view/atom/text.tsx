import { SvgIconComponent } from "@mui/icons-material";
import { FC, useState } from "react";
import { useColor } from "~/web/2_store";
import { Center, layout } from "./styling";

export const IconText: FC<{
  color: { bg: string; icon: string; text: string };
  text: string;
  Icon: SvgIconComponent;
  height: number;
}> = ({ color, text, Icon, height }) => {
  return (
    <div style={{ ...layout.colGrid({ column: [height, null] }), height: "auto", background: color.bg }}>
      <Center>
        <Icon style={{ height: height - 10, width: height - 10, color: color.icon }} />
      </Center>
      <div style={{ ...layout.left, fontSize: height - 20, color: color.text }}>{text}</div>
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
      style={{ ...layout.colGrid({ column: [height, null] }), height: "auto", background: color.bg, cursor: "pointer" }}
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
