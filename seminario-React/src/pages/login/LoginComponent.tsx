import React, { useState } from 'react';
import { saveAuthData } from '../../utils/auth';
import '../../assets/styles/LoginComponent.css';

const LoginPage: React.FC = () => {
    
  // Lo que espera el LoginController
  const [usuario, setUsuario] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [contraseña, setContraseña] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!usuario.trim() || !nombre.trim() || !contraseña.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    try {
      console.log(JSON.stringify({ usuario, nombre, contraseña }));
      const response = await fetch('http://localhost:8000/login', { // llamo al back
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, nombre, contraseña })
      });

      // espero rta del back
      const data = await response.json();
      console.log('Respuesta del backend:', data);
      console.log('Payload enviado:', { usuario, nombre, contraseña });

      if (response.ok) {                         // si esta bien la guardo en el buffer o localstorage del navegador 
        const nombreReal = data.Mensaje?.replace('Bienvenido ', '') ?? nombre;
        saveAuthData(data.Token, data.id, nombreReal, nombre); // guardar nombre completo
        window.location.href = '/mis-mazos';     // al loguearse ya puede ver su info
      } else {
        alert(data.Mensaje || 'Error al iniciar sesión');
      }  
    } catch {
        alert('Error de conexión con el servidor');
    } finally {
       setLoading(false);
     }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div style={{ position: 'absolute', top: 30, right: 40 }}>
          <a href="/registro" className="login-registrarse-btn">Registrarse</a>
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
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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
            <button type="submit">Iniciar sesión</button>
            <div className="link-group">
              ¿No tenés cuenta? <a href="/registro">Registrate</a>
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
