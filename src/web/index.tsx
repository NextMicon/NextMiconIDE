import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import { App } from "./4_view/App";
// import "./destyle.css";
import "./index.css";

createRoot(document.getElementById("root") as Element).render(
  <RecoilRoot>
    <Suspense fallback={<div>{"Loading ..."}</div>}>
      <App />
    </Suspense>
  </RecoilRoot>,
);
