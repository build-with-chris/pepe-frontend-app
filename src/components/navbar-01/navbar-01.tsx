import { Button } from "../ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const Navbar01Page = () => {
  const { user, setUser, setToken } = useAuth();
  const navigate = useNavigate();

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
      <nav className="relative h-26 bg-black z-50">
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
                <Link to="/login">
                  <Button
                    variant="secondary"
                    className="text-sm px-3 py-1.5 md:text-base md:px-5 md:py-2.5"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar01Page;
