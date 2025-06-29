import React, { useState } from 'react';
import { useEffect } from 'react';
import '../../assets/styles/MazosPage.css';

const MazosPage: React.FC = () => {
const nombre = localStorage.getItem('nombre') || 'Entrenador';
const [mostrarMazos, setMostrarMazos] = useState(false);
const [mazoSeleccionado, setMazoSeleccionado] = useState<number | null>(null);
const [modalAbierto, setModalAbierto] = useState(false);
const [mazos, setMazos] = useState<any[]>([]);
const [cargando, setCargando] = useState(false);
const [error, setError] = useState<string | null>(null);
const [alerta, setAlerta] = useState<{ tipo: 'success' | 'error', mensaje: string } | null>(null);
const [cartasDelMazo, setCartasDelMazo] = useState<any[]>([]);
const [confirmarEliminar, setConfirmarEliminar] = useState(false);

const obtenerMazos = async () => {
    setCargando(true);
    setError(null);
    try {
      const usuarioData = localStorage.getItem('usuario');
      const token = localStorage.getItem('token');
      if (!usuarioData || !token) throw new Error('No hay sesión activa');
      const { id } = JSON.parse(usuarioData);
      const res = await fetch(`http://localhost:8000/usuarios/${id}/mazos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': 'abc123',
        },
      });
      if (!res.ok) throw new Error('No se pudieron obtener los mazos');
      const data = await res.json();
      setMazos(data);
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const obtenerCartas = async () => {
      if (!modalAbierto || mazoSeleccionado === null) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay token');
        const res = await fetch(`http://localhost:8000/mazos/${mazoSeleccionado}/cartas`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-api-key': 'abc123',
          },
        });
        if (!res.ok) throw new Error('Error al obtener cartas');
        const data = await res.json();
        setCartasDelMazo(data);
      } catch (e) {
        console.error('Error al traer cartas del mazo:', e);
        setCartasDelMazo([]);
      }
    };

    obtenerCartas();
}, [modalAbierto, mazoSeleccionado]);


  const handleVerMazos = () => {
    setMostrarMazos(true);
    setMazoSeleccionado(null);
    obtenerMazos();
  };

  const mazoActivo = mazos.find(m => m.id === mazoSeleccionado);

  const eliminarMazo = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay sesión activa');
      const res = await fetch(`http://localhost:8000/mazos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': 'abc123',
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.Mensaje || data.Error || 'No se pudo eliminar el mazo');
      setAlerta({ tipo: 'success', mensaje: '¡Mazo eliminado correctamente!' });
      setTimeout(() => {
        setModalAbierto(false);
        setMazoSeleccionado(null);
        setAlerta(null);
        setConfirmarEliminar(false);
        obtenerMazos();
      }, 1200);
    } catch (e: any) {
      setAlerta({ tipo: 'error', mensaje: e.message || 'Error al eliminar el mazo' });
    }
  };

  return (
    <div className="mazos-page-bg">
      <img src="/assets/images/arcoiris.jpg" alt="Arcoiris" className="mazos-arcoiris-img" />
      <div className="mazos-card">
        {!mostrarMazos ? (
          <>
            <h1>¡Bienvenido, {nombre}!</h1>
            <p>Aquí podrás ver y gestionar tus mazos de cartas Pokémon.</p>
            <img src="/assets/images/pikachu2.jpg" alt="Pokémon" className="mazos-img" />
            <button className="mazos-btn" onClick={handleVerMazos}>
              Ver mazos
            </button>
          </>
        ) : (
          <>
            <button className="mazos-volver-btn" onClick={() => { setMostrarMazos(false); setMazoSeleccionado(null); }}>
              <span className="flecha">←</span> Volver
            </button>
            <h2>Mis Mazos</h2>
            {cargando && <p>Cargando mazos...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            <ul className="mazos-list">
              {mazos.map((mazo) => (
                <li key={mazo.id}>
                  <div
                    className={`mazo-nombre ${mazoSeleccionado === mazo.id ? 'seleccionado' : ''}`}
                    onClick={() => setMazoSeleccionado(mazo.id)}
                  >
                    {mazo.nombre}
                  </div>
                </li>

              ))}
            </ul>
            <div className="mazos-acciones">
              <button
                className="mazos-accion-btn"
                disabled={!mazoSeleccionado}
                onClick={() => setModalAbierto(true)}
              >
                Ver mazo
              </button>
              <button
                className="mazos-accion-btn"
                disabled={!mazoSeleccionado}
              >
                Jugar
              </button>
            </div>
          </>
        )}
        {/* Modal para ver mazo */}
        {modalAbierto && mazoActivo && (
          <div className="mazos-modal-bg">
            <div className="mazos-modal">
              <h3>{mazoActivo.nombre}</h3>
              <ul className="mazos-cartas-list">
                {cartasDelMazo.map((carta: any, i: number) => (
                  <li key={i}>{carta.nombre || JSON.stringify(carta)}</li>
                ))}
              </ul>
              <div className="mazos-modal-acciones">
                {confirmarEliminar ? (
                  <div className="mazos-confirmar-eliminar">
                    <p>¿Estás seguro de que deseas eliminar este mazo?</p>
                    <div className="mazos-confirmar-acciones">
                      <button className="mazos-accion-btn danger" onClick={() => eliminarMazo(mazoActivo.id)}>Sí, eliminar</button>
                      <button className="mazos-accion-btn" onClick={() => setConfirmarEliminar(false)}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button className="mazos-accion-btn">Editar mazo</button>
                    <button className="mazos-accion-btn" onClick={() => setConfirmarEliminar(true)}>Eliminar mazo</button>
                    <button className="mazos-accion-btn" onClick={() => { setModalAbierto(false); setAlerta(null); setConfirmarEliminar(false); }}>Cerrar</button>
                  </>
                )}
              </div>
              {alerta && (
                <div className={`mazos-alerta ${alerta.tipo}`}>{alerta.mensaje}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MazosPage; 