import { CSSProperties, FC, MouseEventHandler, ReactNode } from "react";

export const Grid: FC<{
  children: ReactNode;
  row?: string[];
  column?: string[];
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  hoverOn?: () => void;
  hoverOff?: () => void;
}> = ({ children, row, column, style, onClick, hoverOn, hoverOff }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: column?.join(" ") ?? "100%",
      gridTemplateRows: row?.join(" ") ?? "100%",
      ...style,
    }}
    onMouseEnter={hoverOn}
    onMouseLeave={hoverOff}
    onClick={onClick}
  >
    {children}
  </div>
);

export const cssGrid = ({ row, column }: { row?: string[]; column?: string[] }): CSSProperties => {
  return {
    display: "grid",
    gridTemplateColumns: column?.join(" ") ?? "100%",
    gridAutoColumns: undefined,
    gridTemplateRows: row?.join(" ") ?? "100%",
    gridAutoRows: undefined,
  };
};

export const cssCenter: CSSProperties = { display: "flex", justifyContent: "center", alignItems: "center" };
export const cssLeft: CSSProperties = { display: "flex", justifyContent: "left", alignItems: "center" };
export const cssRight: CSSProperties = { display: "flex", justifyContent: "right", alignItems: "center" };

export const Center: FC<{ children: ReactNode; style?: CSSProperties }> = ({ children, style }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", ...style }}>{children}</div>
);

export const Left: FC<{ children: ReactNode; style?: CSSProperties }> = ({ children, style }) => (
  <div style={{ display: "flex", justifyContent: "left", alignItems: "center", ...style }}>{children}</div>
);

export const cssFlex = ({
  direction,
  justify,
  align,
}: {
  direction: "horizontal" | "vertical";
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
}): CSSProperties => {
  const flexDirection = (direction === "horizontal" && "row") || (direction === "vertical" && "column") || undefined;
  return { display: "flex", flexDirection, justifyContent: justify, alignItems: align };
};

export const Flex: FC<{
  children: ReactNode;
  direction: "horizontal" | "vertical";
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  style?: CSSProperties;
}> = ({ children, direction, justify, align, style }) => {
  const flexDirection = (direction === "horizontal" && "row") || (direction === "vertical" && "column") || undefined;
  return <div style={{ display: "flex", flexDirection, justifyContent: justify, alignItems: align, ...style }}>{children}</div>;
};
