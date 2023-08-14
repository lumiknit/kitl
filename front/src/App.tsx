import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import KitlEditor from "./components/KitlEditor/KitlEditor.tsx";
import { Toaster } from "react-hot-toast";

const App = () => (
  <>
    <Toaster
      position="bottom-center"
      containerStyle={{
        zIndex: 9999,
      }}
      toastOptions={{
        style: {
          zIndex: 9999,
        }
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
