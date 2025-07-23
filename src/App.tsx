import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Anfragen from './pages/Anfragen';
import Kuenstler from './pages/Kuenstler';
import {Login} from './components/login-form'
import Footer from './components/footer-04/footer-04'
import Navbar01Page from './components/navbar-01/navbar-01';

function App() {
  const location = useLocation();

  return (

    <div className="bg-black text-white min-h-screen">
      <Navbar01Page />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anfragen" element={<Anfragen />} />
        <Route path="/kuenstler" element={<Kuenstler />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    {location.pathname !== '/anfragen' && <Footer />}
    </div>
  )
}

export default App