import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { buildApiUrl, getAuthHeaders } from '../../config/api';
import "../../assets/styles/EditarUsuarioPage.css";

const EditarUsuarioPage = () => {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [id, setId] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [errores, setErrores] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Obtener datos del usuario al montar
  useEffect(() => {
    const usuarioData = localStorage.getItem("usuario");
    if (!usuarioData) return;

    const { id, token } = JSON.parse(usuarioData);
    axios.get(buildApiUrl(`/usuarios/${id}`), {
      headers: getAuthHeaders(token)
    })
      .then(res => {
        setNombre(res.data.Nombre || '');
        setUsuario(res.data.Usuario || '');
        setId(res.data.ID || null);
      })
      .catch(err => setErrores(["No se pudo cargar la información del usuario."]));
  }, []);

  const validarCampos = (): string[] => {
    const erroresValidacion: string[] = [];

    if (!nombre.trim()) {
      erroresValidacion.push("El nombre completo no puede estar vacío.");
    } else if (nombre.length > 30) {
      erroresValidacion.push("El nombre completo debe tener como máximo 30 caracteres.");
    }
    if (!usuario.trim()) {
      erroresValidacion.push("El usuario no puede estar vacío.");
    } else if (usuario.length > 30) {
      erroresValidacion.push("El usuario debe tener como máximo 30 caracteres.");
    }

    // Solo validar contraseña si el usuario quiere cambiarla
    if (mostrarPassword && password) {
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
      if (password !== repetirPassword) {
        erroresValidacion.push("Las contraseñas no coinciden.");
      }
    }

    return erroresValidacion;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrores([]);
    setMensaje('');

    const erroresDetectados = validarCampos();
    if (erroresDetectados.length > 0) {
      setErrores(erroresDetectados);
      return;
    }

    try {
      const usuarioData = localStorage.getItem("usuario");
      if (!usuarioData) throw new Error("No se encontró sesión de usuario.");

      const { id, token } = JSON.parse(usuarioData);

      const payload: any = {
        nombre,
        usuario
      };
      if (mostrarPassword && password) {
        payload.contraseña = password;
      }
      await axios.put(buildApiUrl(`/usuarios/${id}`), payload, {
        headers: getAuthHeaders(token)
      });

      setMensaje("Usuario actualizado correctamente.");
      setPassword('');
      setRepetirPassword('');
    } catch (error: any) {
      // Muestra el error completo en consola
      console.error("ERROR COMPLETO:", error);

      // Intenta mostrar errores de validación específicos
      if (error.response?.data?.Errores) {
        setErrores([JSON.stringify(error.response.data.Errores)]);
      } else if (error.response?.data?.Mensaje) {
        setErrores([error.response.data.Mensaje]);
      } else if (error.response?.data) {
        setErrores([JSON.stringify(error.response.data)]);
      } else {
        setErrores(["Ocurrió un error al actualizar el usuario"]);
      }
    }
  };

  return (
    <div className="editar-usuario-bg">
      <img src="/assets/images/arcoiris.jpg" alt="Arcoiris" className="editar-arcoiris-img" />
      <div className="editar-usuario-container">
        <h2>Editar Usuario</h2>

        <form onSubmit={handleSubmit} className="input-group">
          <label>Nombre completo
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>
          <label>Usuario
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </label>
          <button type="button" style={{marginBottom:'1rem'}} onClick={() => setMostrarPassword(!mostrarPassword)}>
            {mostrarPassword ? 'Ocultar cambio de contraseña' : 'Cambiar contraseña'}
          </button>
          {mostrarPassword && (
            <>
              <input
                type="password"
                placeholder="Contraseña nueva"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Repetir contraseña"
                value={repetirPassword}
                onChange={(e) => setRepetirPassword(e.target.value)}
              />
            </>
          )}
          <button type="submit">Guardar cambios</button>
        </form>

        {errores.length > 0 && (
          <ul className="errores">
            {errores.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        )}

        {mensaje && <p className="mensaje-ok">{mensaje}</p>}
      </div>
    </div>
  );
};

export default EditarUsuarioPage;
