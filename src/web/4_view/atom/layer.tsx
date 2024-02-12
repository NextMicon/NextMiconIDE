import { FC, ReactNode } from "react";

export const Layer: FC<{ children: ReactNode; zIndex: number }> = ({ children, zIndex }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        background: "transparent",
        pointerEvents: "none",
        zIndex: zIndex,
      }}
    >
      {children}
    </div>
  );
};

export const Dialog: FC<{ children: ReactNode; zIndex: number; close: () => void }> = ({ children, zIndex, close }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#00000080",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: zIndex,
      }}
      onClick={close}
    >
      <div style={{ maxWidth: "800px", maxHeight: "600px", padding: "50px", overflow: "hidden" }}>
        <div style={{ background: "white", borderRadius: "4px", padding: "10px" }} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
};
