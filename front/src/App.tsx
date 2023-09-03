import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import KitlEditor from "./components/KitlEditor/KitlEditor.tsx";
import { Toaster } from "react-hot-toast";

import "./dark-mode-detect.ts";
import "./variables.scss";
import "./default-theme.scss";

const App = () => (
  <>
    <Toaster
      position="bottom-center"
      containerStyle={{
        zIndex: 9999,
      }}
      toastOptions={{
        style: {
          background: "var(--kitl-bg-1-color)",
          color: "var(--kitl-fg-color)",
          boxShadow: "0 0.0625rem 0.125rem #00000080",
        },
      }}
    />
    <Router>
      <Routes>
        <Route path="/" element={<KitlEditor />} />
        <Route path="/test" element={<h1>Test</h1>} />
      </Routes>
    </Router>
  </>
);

export default App;
