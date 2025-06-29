import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/NavBarComponent.css';

const NavBarComponent: React.FC = () => {
  const token = localStorage.getItem('token');
  const nombre = localStorage.getItem('nombre');
  const logueado = !!token;
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    window.location.href = '/login'; 
  };

  return (
    <nav className="navbar-poke">
      <div className="navbar-logo">
        <img src="/assets/images/descarga.png" alt="Pokeball" />
        <span className="navbar-title">Pokebattle</span>
      </div>
      <div className="navbar-links">
        {logueado ? (
          <>
            <span className="navbar-user">Hola, {nombre}</span>
            <Link to="/mis-mazos">Mis Mazos</Link>
            <Link to="/editar-usuario">Editar mis datos</Link>
            <button className="navbar-logout" onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            {location.pathname === '/login' && (
              <Link to="/registro">Registrarse</Link>
            )}
            {location.pathname === '/registro' && (
              <Link to="/login">Iniciar sesión</Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBarComponent;
