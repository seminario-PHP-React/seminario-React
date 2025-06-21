import React, { useState } from 'react';
import axios from 'axios';
import "../../assets/styles/RegistroPage.css";

const RegistroPage = () => {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState('');

  const validarCampos = async () => {
    const erroresValidacion: string[] = [];

    // Validar usuario
    if (usuario.length < 6 || usuario.length > 20) {
      erroresValidacion.push("El usuario debe tener entre 6 y 20 caracteres.");
    }
    if (!/^[a-zA-Z0-9]+$/.test(usuario)) {
      erroresValidacion.push("El usuario solo puede contener caracteres alfanuméricos.");
    }

    // Validar nombre
    if (!nombre.trim()) {
      erroresValidacion.push("El nombre no puede estar vacío.");
    } else if (nombre.length > 30) {
      erroresValidacion.push("El nombre debe tener como máximo 30 caracteres.");
    }

    // Validar contraseña
    if (password.length < 8) {
      erroresValidacion.push("La contraseña debe tener al menos 8 caracteres.");
    }
    if (!/[A-Z]/.test(password)) {
      erroresValidacion.push("La contraseña debe contener al menos una letra mayúscula.");
    }
    if (!/[a-z]/.test(password)) {
      erroresValidacion.push("La contraseña debe contener al menos una letra minúscula.");
    }
    if (!/[0-9]/.test(password)) {
      erroresValidacion.push("La contraseña debe contener al menos un número.");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      erroresValidacion.push("La contraseña debe contener al menos un carácter especial.");
    }

    // Verificar si el usuario ya existe (si se cumplio todo lo anterior)
    if (erroresValidacion.length === 0) {
      try {
        const res = await axios.post('http://localhost:8000/usuario/check', { usuario });
        if (res.data.enUso) {
          erroresValidacion.push("El nombre de usuario ya existe.");
        }
      } catch (e) {
        erroresValidacion.push("Error al verificar si el usuario está en uso.");
      }
    }

    return erroresValidacion;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrores([]);
    setMensaje('');

    const erroresDetectados = await validarCampos();
    if (erroresDetectados.length > 0) {
      setErrores(erroresDetectados);
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/registro', {
        nombre,
        usuario,
        contraseña:password
      });
      setMensaje(res.data.message || "Registro exitoso.");
      setNombre('');
      setUsuario('');
      setPassword('');
    } catch (error: any) {
        console.error("ERROR COMPLETO:", error); // 👈 esto te lo imprime en consola
        const mensaje =
            error.response?.data?.Mensaje ||
            error.response?.data?.error ||
            JSON.stringify(error.response?.data) ||
            "Error en el registro.";
        setErrores([mensaje]);

    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="registro-form">
        <input
          type="text"
          placeholder="Nombre del usuario"
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
        <button type="submit">Registrarse</button>
      </form>

      {errores.length > 0 && (
        <ul className="errores">
          {errores.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}

      {mensaje && <p className="mensaje-ok">{mensaje}</p>}
    </div>
  );
};

export default RegistroPage;
