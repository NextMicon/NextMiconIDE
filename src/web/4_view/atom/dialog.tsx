import { FC, ReactNode } from "react";

export const Dialog: FC<{ children: ReactNode; close: () => void }> = ({ children, close }) => {
  return (
    <div style={{ position: "absolute", width: "100vw", height: "100vh", background: "#00000080" }} onClick={close}>
      {children}
    </div>
  );
};
