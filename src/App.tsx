import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Anfragen from './pages/Anfragen';
import Kuenstler from './pages/Kuenstler';
import {Login} from './components/login-form'
import SignUp from './components/SignUp'
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import Footer from './components/footer-04/footer-04'
import Navbar01Page from './components/navbar-01/navbar-01';
import Profile from './pages/ProfileSetup.tsx'
import SplashScreen from './pages/SplashScreen';

function App() {
  const location = useLocation();

  return (

    <div className="bg-black text-white min-h-screen">
      {location.pathname !== '/splash' && <Navbar01Page />}
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/anfragen" element={<Anfragen />} />
        <Route path="/kuenstler" element={<Kuenstler />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile/>} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    {location.pathname !== '/anfragen' && <Footer />}
    </div>
  )
}

export default App