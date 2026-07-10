import { createRoot } from "react-dom/client";
import { setExtraHeadersGetter } from "@workspace/api-client-react";
import App from "./App";
import { getOrCreateUserId } from "./lib/userId";
import "./index.css";

const userId = getOrCreateUserId();
setExtraHeadersGetter(() => ({ "x-user-id": userId }));

createRoot(document.getElementById("root")!).render(<App />);
