import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header>
      <nav id="nav-bar" className="flex-column">
        <ul className="flex-column">
          <li>
            <NavLink to="/index" className = {(navData) => (navData.isActive ? "active-page" : "none")}>
              <i className="fa fa-music"></i>
              <span>Ma Bibliothèque</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/create_playlist" className = {(navData) => (navData.isActive ? "active-page" : "none")}>
              <i className="fa fa-plus"></i>
              <span>Créer Playlist</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={(navData) => (navData.isActive ? "active-page" : "none")}>
              <i className="fa fa-info-circle"></i>
              <span>À Propos</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
