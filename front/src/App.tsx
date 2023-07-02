import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import EditorRoot from "./components/EditorRoot.tsx";

const App = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        element={
          <>
            <EditorRoot editing="flow" />
          </>
        }
      />
      <Route path="/test" element={<h1>Test</h1>} />
    </Routes>
  </Router>
);

export default App;
