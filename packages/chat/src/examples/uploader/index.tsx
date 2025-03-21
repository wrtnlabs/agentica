import { createRoot } from "react-dom/client";

import { AgenticaChatUploaderApplication } from "./AgenticaChatPlaygroundApplication";

createRoot(window.document.getElementById("root")!).render(
  <AgenticaChatUploaderApplication
    style={{
      width: "calc(100% - 30px)",
      height: "calc(100% - 30px)",
      overflowY: "auto",
      padding: 15,
    }}
    onSuccess={(element) => {
      createRoot(window.document.getElementById("root")!).render(element);
    }}
  />,
);
