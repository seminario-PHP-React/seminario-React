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
    window.location.href = '/'; 
  };

  return (
    <nav className="navbar-poke">
      <div className="navbar-logo" style={{cursor: 'pointer'}} onClick={() => window.location.href = '/'}>
        <img src="/assets/images/logo.jpg" alt="Pokeball" />
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
              <>
                <Link to="/estadisticas">Estadísticas</Link>
                <Link to="/registro">Registrarse</Link>
              </>
            )}
            {location.pathname === '/registro' && (
              <>
                <Link to="/estadisticas">Estadísticas</Link>
                <Link to="/login">Iniciar sesión</Link>
              </>
            )}
            {location.pathname !== '/login' && location.pathname !== '/registro' && (
              <>
                <Link to="/login">Iniciar sesión</Link>
                <Link to="/registro">Registrarse</Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBarComponent;
