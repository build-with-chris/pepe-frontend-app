import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Anfragen from './pages/Anfragen';
import Kuenstler from './pages/Kuenstler';
import {Login} from './components/login-form'
import SignUp from './components/SignUp'
import Admin from './pages/Admin';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import Footer from './components/footer-04/footer-04'
import Navbar01Page from './components/navbar-01/navbar-01';
import Profile from './pages/ProfileSetup.tsx'
import SplashScreen from './pages/SplashScreen';
import CalendarPage from './pages/Kalender';
import Kontakt from './pages/Kontakt';
import MyGigs from './pages/MyGigs';
import MeineAnfragen from './pages/MeineAnfragen';
import Rechnungen from './pages/Invoices';
import AnstehendeGigs from './pages/PendingGigs';
import KuenstlerVerwaltung from './pages/Artists';
import OfferEditPage from './pages/OfferEditPage';
import Buchhaltung from './pages/Buchhaltung'
import NotFound from './pages/404';
import ArtistGuidlines from './pages/ArtistGuidlines.tsx';


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
        <Route path="/kontakt" element={<Kontakt maxWidthClass='max-w-xl' />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      
        <Route element={<ProtectedRoute />}>
          <Route path="/buchhaltung" element={<Buchhaltung />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/kalender" element={<CalendarPage />} />
          <Route path="/meine-gigs" element={<MyGigs />} />
          <Route path="/meine-anfragen" element={<MeineAnfragen />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/rechnungen" element={<Rechnungen />} />
          <Route path="/admin/anstehende-gigs" element={<AnstehendeGigs />} />
          <Route path="/admin/kuenstler" element={<KuenstlerVerwaltung />} />
          <Route
            path="/admin/requests/:reqId/offers/:offerId/edit"
            element={<OfferEditPage />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/artist-guidelines" element={<ArtistGuidlines />} />
      </Routes>
    {!['/anfragen', '/login', '/signup', '/buchhaltung', '/profile', '/kalender', '/meine-gigs', '/meine-anfragen'].includes(location.pathname) && <Footer />}
    </div>
  )
}

export default App