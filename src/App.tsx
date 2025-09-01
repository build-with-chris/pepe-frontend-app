import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import posthog from './lib/posthog';
import { useEffect } from 'react';
import Home from './pages/Home';
import Anfragen from './pages/Anfragen';
import Kuenstler from './pages/Kuenstler';
import {Login} from './components/login-form'
import SignUp from './components/SignUp'
import Admin from './pages/Admin';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import Footer from './components/footer-04/footer-04'
import Navbar01Page from './components/navbar-01/navbar-01';
import Profile from './pages/ProfileSetup/ProfileSetup.tsx'
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
import { Faq1 } from './components/faq1.tsx';
import Shows from './pages/Shows.tsx';
import Agentur from './pages/Agentur.tsx';
import Referenzen from './pages/Referenzen.tsx';
import Impressum from './pages/Impressum.tsx';
import Datenschutz from './pages/Datenschutz.tsx';
import AGB from './pages/AGB.tsx';
import Gallerie from './pages/Galerie.tsx'
import Mediamaterial from './pages/Mediamaterial.tsx';
import TechnicalRider from './pages/TechnicalRider.tsx';
import Brandguide from './pages/Brandguid.tsx';
import Pressemappe from './pages/Pressemappe.tsx';
import "./i18n"

function App() {
  const location = useLocation();

  useEffect(() => {
    // Nur tracken, wenn PostHog aktiv ist
    if ((posthog as any)?.capture) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        path: location.pathname,
      });
    }
  }, [location.pathname]);

  return (

    <div className="bg-black text-white min-h-screen">
      {location.pathname !== '/splash' && <Navbar01Page />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/anfragen" element={<Anfragen />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/faq" element={<Faq1 />} />
        <Route path="/galerie" element={<Gallerie />} />
        <Route path="/mediamaterial" element={<Mediamaterial />} />

        <Route path="/shows" element={<Shows />} />
        <Route path="/referenzen" element={<Referenzen />} />
        
        <Route path="/kuenstler" element={<Kuenstler />} />
        <Route path="/agentur" element={<Agentur />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/agb" element={<AGB />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/technical-rider" element={<TechnicalRider />} />
        <Route path="/brandguide" element={<Brandguide />} />
        <Route path="/pressemappe" element={<Pressemappe />} />

      
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
        <Route path="/onboarding" element={<ArtistGuidlines />} />
      </Routes>
    {!['/anfragen', '/login', '/signup', '/buchhaltung', '/profile', '/kalender', '/meine-gigs', '/meine-anfragen'].includes(location.pathname) && <Footer />}
    </div>
  )
}

export default App