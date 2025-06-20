import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/NavBarComponent.css';



const NavBarComponent: React.FC = () => {
  const token = localStorage.getItem('token');
  const nombre = localStorage.getItem('nombre');
  const logueado = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    window.location.href = '/login'; 
  };

  return (
    <nav>
      {logueado ? ( 
        <>  {/* si esta logueado*/}
          <span>Hola, {nombre}</span>
          <Link to="/mis-mazos">Mis Mazos</Link>
          <Link to="/editar-usuario">Editar mis datos</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>  {/* si no esta logueado*/}
          <Link to="/registro">Registrarse</Link>
          <Link to="/login">Iniciar sesión</Link>
        </>
      )}
    </nav>
  );
};

export default NavBarComponent;
