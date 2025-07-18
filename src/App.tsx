import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Anfragen from './pages/Anfragen';
import Kuenstler from './pages/Kuenstler';


function App() {
  const location = useLocation();
  return (
    <div className="bg-black text-white min-h-screen">
      {location.pathname !== '/anfragen' && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anfragen" element={<Anfragen />} />
        <Route path="/kuenstler" element={<Kuenstler />} />

      </Routes>

    </div>
  )
}

export default App