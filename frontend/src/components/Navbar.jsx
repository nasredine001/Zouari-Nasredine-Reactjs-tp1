import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiUsers, FiUserPlus, FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FiUsers /> GestContacts
      </div>
      <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
        {open ? <FiX /> : <FiMenu />}
      </button>
      <div className={`navbar-links ${open ? 'open' : ''}`}>
        <NavLink to="/" end onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
          <FiUsers /> Liste des contacts
        </NavLink>
        <NavLink to="/ajouter" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
          <FiUserPlus /> Ajouter un contact
        </NavLink>
      </div>
    </nav>
  );
}
