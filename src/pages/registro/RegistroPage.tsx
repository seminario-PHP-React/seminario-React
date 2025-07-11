import React, { useState } from 'react';
import axios from 'axios';
import "../../assets/styles/RegistroPage.css";

const RegistroPage = () => {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrores([]);
    setMensaje('');

    try {
      const res = await axios.post('/registro', {
        nombre,
        usuario,
        contraseña: password
      });
      
      setMensaje(res.data.message || "Registro exitoso.");
      setNombre('');
      setUsuario('');
      setPassword('');
      setConfirmPassword('');
      
    } catch (error: any) {
      const mensaje = error.response?.data?.Mensaje || "Error en el registro.";
      setErrores([mensaje]);
    }
  };

  return (
  <div className="registro-page">
    <div className="registro-container">
      <h2>Registro de Usuario</h2>

      <form onSubmit={handleSubmit} className="input-group">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Registrarse</button>
      </form>

      {errores.length > 0 && (
        <ul className="errores">
          {errores.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}

      {mensaje && <p className="mensaje-ok">{mensaje}</p>}

      <div className="link-group">
        ¿Ya tenés cuenta? <a href="/login">Iniciar sesión</a>
      </div>
    </div>
  </div>
);
};

export default RegistroPage;
