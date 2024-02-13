import { CSSProperties, FC, ReactNode } from "react";

const gridTemplate = (arr: (string | number | null)[]): string => {
  return arr
    .map((e) => {
      if (typeof e === "string") return e;
      if (typeof e === "number") return `${e}px`;
      return "1fr";
    })
    .join(" ");
};

const gridAuto = (e?: string | number) => {
  if (typeof e === "string") return e;
  if (typeof e === "number") return `${e}px`;
  return "100%";
};

export const css = {
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
  right: { display: "flex", justifyContent: "right", alignItems: "center" } as CSSProperties,

  grid: ({ row, column }: { row: (string | number | null)[]; column: (string | number | null)[] }): CSSProperties => {
    return {
      display: "grid",
      gridTemplateColumns: gridTemplate(column),
      gridTemplateRows: gridTemplate(row),
    };
  },
  colGrid: ({ column, row }: { column: (string | number | null)[]; row?: string | number }): CSSProperties => {
    return {
      display: "grid",
      gridTemplateColumns: gridTemplate(column),
      gridAutoRows: gridAuto(row),
    };
  },
  rowGrid: ({ row, column }: { row: (string | number | null)[]; column?: string | number }): CSSProperties => {
    return {
      display: "grid",
      gridTemplateRows: gridTemplate(row),
      gridAutoColumns: gridAuto(column),
    };
  },
};

export const Left: FC<{ children?: ReactNode }> = ({ children }) => <div style={css.left}>{children}</div>;
export const Right: FC<{ children?: ReactNode }> = ({ children }) => <div style={css.right}>{children}</div>;
export const Center: FC<{ children?: ReactNode }> = ({ children }) => <div style={css.center}>{children}</div>;
