import { CSSProperties, FC, ReactNode } from "react";

export const layout = {
  flex: ({
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
  },
  center: { display: "flex", justifyContent: "center", alignItems: "center" } as CSSProperties,
  left: { display: "flex", justifyContent: "left", alignItems: "center" } as CSSProperties,
  right: { display: "flex", justifyContent: "left", alignItems: "center" } as CSSProperties,

  grid: ({ row, column }: { row?: string[]; column?: string[] }): CSSProperties => ({
    display: "grid",
    gridTemplateColumns: column?.join(" ") ?? "100%",
    gridAutoColumns: undefined,
    gridTemplateRows: row?.join(" ") ?? "100%",
    gridAutoRows: undefined,
  }),
};

export const Left: FC<{ children?: ReactNode }> = ({ children }) => <div style={layout.left}>{children}</div>;
export const Right: FC<{ children?: ReactNode }> = ({ children }) => <div style={layout.right}>{children}</div>;
export const Center: FC<{ children?: ReactNode }> = ({ children }) => <div style={layout.center}>{children}</div>;
