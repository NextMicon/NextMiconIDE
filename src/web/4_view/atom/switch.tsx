import { FC, ReactNode } from "react";

export const Show: FC<{ children: ReactNode; when: boolean }> = ({ children, when }) => (
  <div style={{ display: when ? undefined : "none" }}>{children}</div>
);
