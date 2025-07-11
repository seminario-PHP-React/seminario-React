import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveAuthData } from '../../utils/auth';
import { API_CONFIG } from '../../config/api';
import '../../assets/styles/LoginComponent.css';

const LoginPage: React.FC = () => {
    
  // Lo que espera el LoginController
  const [usuario, setUsuario] = useState<string>('');
  const [contraseña, setContraseña] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    setLoading(true);

    try {
      console.log(JSON.stringify({ "usuario":usuario, "contraseña":contraseña }));
      const response = await fetch('/login', { // usar proxy de Vite
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "usuario":usuario, "contraseña":contraseña })
      });

      // espero rta del back
      const data = await response.json();
      console.log('Respuesta del backend:', data);
      console.log('Payload enviado:', { usuario, contraseña });

      if (response.ok) {                         // si esta bien la guardo en el buffer o localstorage del navegador 
        const nombreReal = data.Mensaje?.replace('Bienvenido ', '');
        saveAuthData(data.Token, data.id, nombreReal); // guardar nombre completo
        window.location.href = '/mis-mazos';     // al loguearse ya puede ver su info
      } else {
        setError(data.Mensaje || 'Error al iniciar sesión');
      }  
    } catch (error) {
        setError('Error de conexión con el servidor');
    } finally {
       setLoading(false);
     }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="absolute-top-right">
          <Link to="/registro" className="login-registrarse-btn">Registrarse</Link>
        </div>
        <div className="login-form-side">
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
            {error && (
              <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                {error}
              </div>
            )}
            <div className="link-group">
              ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
            </div>
          </form>
        </div>
        <div className="login-image-side">
          <img src="/assets/images/descarga.png" alt="Decoración Pokémon" />
        </div>
      </div>
    </div>
  );
};

  export default LoginPage;
