import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { CSSProperties, FC, ReactNode, useState } from "react";
import { IconTextButton } from "./text";

export const Accordion: FC<{
  color: {
    bg: string;
    icon: string;
    text: string;
  };
  children: ReactNode;
  title: string;
  style?: CSSProperties;
  externalOpenState?: boolean;
  defaultOpen?: boolean;
}> = ({ color, children, title, style, externalOpenState: open, defaultOpen = false }) => {
  const [localOpenState, setLocalOpenState] = useState(defaultOpen);
  const isOpen = open ?? localOpenState;
  return (
    <div style={{ height: "auto", overflow: "hidden", ...style }}>
      <IconTextButton
        color={color}
        Icon={isOpen ? KeyboardArrowDown : KeyboardArrowRight}
        text={title}
        height={50}
        onClick={() => setLocalOpenState(!localOpenState)}
      />
      {isOpen && children}
    </div>
  );
};
