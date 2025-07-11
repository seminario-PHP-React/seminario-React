import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/NavBarComponent.css';

const NavBarComponent: React.FC = () => {
  const [logueado, setLogueado] = useState(false);
  const [nombre, setNombre] = useState('');
  const location = useLocation();

  // Verificar si el token es válido
  const verificarToken = async (token: string) => {
    try {
      const response = await fetch('/usuarios/verificar-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        localStorage.removeItem('nombre');
        localStorage.removeItem('usuario');
        setLogueado(false);
        setNombre('');
        return false;
      }
      
      return true;
    } catch (error) {
      // Error de conexión, asumimos que el token es válido por ahora
      return true;
    }
  };

  // Verificar estado de autenticación
  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombreUsuario = localStorage.getItem('nombre');
    
    if (token && nombreUsuario) {
      // Verificar token en el backend
      verificarToken(token).then((esValido) => {
        if (esValido) {
          setLogueado(true);
          setNombre(nombreUsuario);
        }
      });
    } else {
      setLogueado(false);
      setNombre('');
    }
  }, []);

  // Verificar token cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        verificarToken(token);
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('usuario');
    setLogueado(false);
    setNombre('');
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
