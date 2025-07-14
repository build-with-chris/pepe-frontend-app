import React from "react";
import LogoPepe from "../assets/LogoPepe.png"
import { NavLink, Link } from "react-router-dom"

export default function Header() {
    return (
        <header className="flex justify-between p-5">
            <Link to="/">
                <img className="h-12 w-auto" src={LogoPepe} alt="Logo PepeShows" />
            </Link>
            <nav className="flex gap-5">
                <NavLink to="/" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Mission</NavLink>
                <NavLink to="/anfragen" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Anfragen</NavLink>
                <NavLink to="/kuenstler" className={({ isActive }) => isActive ? 'font-bold' : undefined}>Künstler</NavLink>
            </nav>

        </header>
    )
}