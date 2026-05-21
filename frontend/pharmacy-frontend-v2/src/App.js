import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Medicines from './pages/Medicines';
import Expiring from './pages/Expiring';
import Suppliers from './pages/Suppliers';
import { getExpiringMedicines } from './services/api';

function App() {
  const [expiringCount, setExpiringCount] = useState(0);

  useEffect(() => {
    getExpiringMedicines().then((res) => setExpiringCount(res.data.data.length));
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '260px', flex: 1, minHeight: '100vh', background: '#f0faf4' }}>
          <Navbar expiringCount={expiringCount} />
          <div style={{ padding: '30px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/medicines" element={<Medicines />} />
              <Route path="/expiring" element={<Expiring />} />
              <Route path="/suppliers" element={<Suppliers />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;