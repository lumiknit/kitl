import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import KitlEditor from "./components/KitlEditor/KitlEditor.tsx";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<KitlEditor />} />
      <Route path="/test" element={<h1>Test</h1>} />
    </Routes>
  </Router>
);

export default App;
