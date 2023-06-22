import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import JsonEditor from './components/JsonEditor/JsonEditor.tsx';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={JsonEditor()} />
      <Route path="/test" element={<h1>Test</h1>} />
    </Routes>
  </Router>
);

export default App;
