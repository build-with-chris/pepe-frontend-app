import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type NavLinksProps = {
  layout?: "desktop" | "mobile";
  onNavigate?: () => void;
  className?: string;
};

export const NavLinks: React.FC<NavLinksProps> = ({
  layout = "desktop",
  onNavigate,
  className = "",
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  let links: { to: string; label: string }[] = [];

  if (!user) {
    // Public links (only when logged out)
    links = [
      { to: "/home", label: t("nav.home", "Home") },
      { to: "/kuenstler", label: t("nav.artists", "Künstler") },
      { to: "/shows", label: t("nav.shows", "Shows") },
      { to: "/galerie", label: t("nav.gallery", "Galerie") },
      { to: "/kontakt", label: t("nav.contact", "Kontakt") },
    ];
  } else {
    if ((user as any).role === "admin") {
      // Admin links only
      links = [
        { to: "/admin", label: t("nav.admin.dashboard", "Dashboard") },
        { to: "/admin/rechnungen", label: t("nav.admin.invoices", "Rechnungen") },
        { to: "/admin/anstehende-gigs", label: t("nav.admin.upcomingGigs", "Anstehende Gigs") },
        { to: "/admin/kuenstler", label: t("nav.admin.artists", "Künstler") },
      ];
    } else {
      // Authenticated artist/user links
      links = [
        { to: "/buchhaltung", label: t("nav.user.accounting", "Buchhaltung") },
        { to: "/profile", label: t("nav.user.profile", "Profil") },
        { to: "/kalender", label: t("nav.user.calendar", "Kalender") },
        { to: "/meine-gigs", label: t("nav.user.myGigs", "Meine Gigs") },
        { to: "/meine-anfragen", label: t("nav.user.requests", "Anfragen") },
      ];
    }
  }

  const linkClass =
    layout === "desktop"
      ? "px-3 py-2 text-sm text-gray-100 hover:text-white"
      : "block rounded-xl px-4 py-4 text-xl text-gray-100 hover:bg-white/10";

  return (
    <nav className={className}>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={linkClass}
          onClick={onNavigate}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};