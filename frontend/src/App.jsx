import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import QuerySelectionPage from './pages/QuerySelectionPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/queries" element={<QuerySelectionPage />} />
        <Route path="/analyze" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
