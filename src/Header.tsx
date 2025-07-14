import React from "react";
import LogoPepe from "./assets/LogoPepe.png"
import { NavLink } from "react-router-dom"

export default function Header() {
    return (
        <header className="flex justify-between p-5">
            <img className="h-12 w-auto" src={LogoPepe} alt="Logo PepeShows" />
            <nav className="flex gap-5">
                <NavLink to="/" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Mission</NavLink>
                <NavLink to="/anfragen" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Anfragen</NavLink>
                <NavLink to="/kuenstler" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Künstler</NavLink>
            </nav>

        </header>
    )
}