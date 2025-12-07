import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import QuerySelectionPage from './pages/QuerySelectionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/queries" element={<QuerySelectionPage />} />
        {/* Results page will be added next */}
      </Routes>
    </Router>
  );
}

export default App;
