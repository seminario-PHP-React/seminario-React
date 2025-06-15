// src/components/NavBarComponent.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBarComponent.css';

const NavBarComponent = ({ isLoggedIn, userName, onLogout }) => {
  return (
    <nav className="navbar">
      <ul>
        {isLoggedIn ? (
          <>
            <li>Hola, {userName}</li>
            <li><Link to="/mis-mazos">Mis mazos</Link></li>
            <li><Link to="/editar-usuario">Editar usuario</Link></li>
            <li><button onClick={onLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/registro">Registro</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBarComponent;
