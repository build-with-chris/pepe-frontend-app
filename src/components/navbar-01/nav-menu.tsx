import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

interface NavMenuExtProps extends NavigationMenuProps {
  user?: any | null; // optional override, falls gewünscht
}

export const NavMenu = ({ user: passedUser, ...props }: NavMenuExtProps) => {
  const { user: contextUser } = useAuth();
  const user = passedUser !== undefined ? passedUser : contextUser;
  const loggedIn = Boolean(user);
  const isAdmin = user?.role === 'admin';


  const menuItems = useMemo(() => {
    console.log('🧭 NavMenu - computing menuItems, isAdmin=', isAdmin, 'loggedIn=', loggedIn);
    if (isAdmin) {
      return [
        { label: 'Dashboard', to: '/admin' },
        { label: 'Rechnungen', to: '/admin/rechnungen' },
        { label: 'Anstehende Gigs', to: '/admin/anstehende-gigs' },
        { label: 'Künstler', to: '/admin/kuenstler' },
      ];
    }
    return loggedIn
      ? [
          { label: 'Profil', to: '/profile' },
          { label: 'Kalender', to: '/kalender' },
          { label: 'Anfragen', to: '/meine-anfragen' },
          { label: 'Meine Gigs', to: '/meine-gigs' },
          { label: 'Buchhaltung', to: '/buchhaltung' },
        ]
      : [
          { label: 'Künstler', to: '/kuenstler' },
          { label: 'Shows', to: '/shows&formate' },
          { label: 'Galerie', to: '/galerie' },
          { label: 'Kontakt', to: '/kontakt' },
        ];
  }, [loggedIn, isAdmin]);

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
        {menuItems.map(item => (
          <NavigationMenuItem key={item.label}>
            <NavigationMenuLink asChild>
              <Link to={item.to}>{item.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
