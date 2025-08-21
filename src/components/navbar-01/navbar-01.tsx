import { Button } from "../ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Navbar01Page = () => {
  const { user, setUser, setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(true);
  const [lastY, setLastY] = useState(0);

  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      // Immer sichtbar nahe am Seitenanfang
      if (y < 8) {
        setShow(true);
      } else {
        // Kleines Hochscrollen → sofort zeigen
        if (y < lastY - 2) setShow(true);
        // Spürbares Runterscrollen → ausblenden
        if (y > lastY + 6) setShow(false);
      }
      setLastY(y);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  const isHomeOrArtists = location.pathname === '/home' || location.pathname === '/kuenstler';

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setUser(null);
    setToken(null);
    navigate("/");
  };

  return (
    <div className="z-50">
      <nav
        className={`fixed top-0 left-0 right-0 w-full h-26 z-50 transition-transform duration-300 ${
          show ? 'translate-y-0' : '-translate-y-full'
        } bg-black/90 backdrop-blur
        `}
      >
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            {user ? (
              <div className="w-auto max-w-xs md:max-w-none">
                <Button
                  variant="secondary"
                  className="text-sm px-3 py-1.5 md:text-base md:px-5 md:py-2.5"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="w-auto max-w-xs md:max-w-none">
                <Link to="/anfragen">
                  <Button
                    variant="secondary"
                    className="text-sm px-3 py-1.5 md:text-base md:px-5 md:py-2.5"
                  >
                    Booking Assistent
                  </Button>
                </Link>
              </div>
            )}
            {/* Language Switcher (desktop) */}
            <div className="hidden md:flex items-center gap-2 text-white">
              <button
                onClick={() => changeLanguage("de")}
                className={`text-xs md:text-sm px-2 py-1 rounded ${i18n.language?.startsWith("de") ? "underline" : "opacity-80 hover:opacity-100"}`}
                aria-label="Deutsch"
              >
                DE
              </button>
              <span className="text-white/40">|</span>
              <button
                onClick={() => changeLanguage("en")}
                className={`text-xs md:text-sm px-2 py-1 rounded ${i18n.language?.startsWith("en") ? "underline" : "opacity-80 hover:opacity-100"}`}
                aria-label="English"
              >
                EN
              </button>
            </div>
            {/* Language Switcher (mobile) */}
            <div className="md:hidden flex items-center gap-2 text-white">
              <button
                onClick={() => changeLanguage("de")}
                className={`text-xs px-2 py-1 rounded ${i18n.language?.startsWith("de") ? "underline" : "opacity-80 hover:opacity-100"}`}
                aria-label="Deutsch"
              >
                DE
              </button>
              <span className="text-white/40">|</span>
              <button
                onClick={() => changeLanguage("en")}
                className={`text-xs px-2 py-1 rounded ${i18n.language?.startsWith("en") ? "underline" : "opacity-80 hover:opacity-100"}`}
                aria-label="English"
              >
                EN
              </button>
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
      {!isHomeOrArtists && <div className="h-26" />}
    </div>
  );
};

export default Navbar01Page;
