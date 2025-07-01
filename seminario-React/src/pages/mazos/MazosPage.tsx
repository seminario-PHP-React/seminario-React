import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
const [editando, setEditando] = useState(false);
const [nuevoNombre, setNuevoNombre] = useState('');
const [agregandoMazo, setAgregandoMazo] = useState(false);
const [nombreNuevoMazo, setNombreNuevoMazo] = useState('');
const [cartasDisponibles, setCartasDisponibles] = useState<any[]>([]);
const [cartasSeleccionadas, setCartasSeleccionadas] = useState<any[]>([]);
const [filtroAtributo, setFiltroAtributo] = useState('');
const [filtroNombre, setFiltroNombre] = useState('');
const [errorForm, setErrorForm] = useState<string | null>(null);
const navigate = useNavigate();

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

// Obtener cartas disponibles para crear mazo
useEffect(() => {
  if (agregandoMazo) {
    const fetchCartas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay sesión activa');
        const res = await fetch('http://localhost:8000/cartas', {
          headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': 'abc123' }
        });
        const data = await res.json();
        setCartasDisponibles(Array.isArray(data.Cartas) ? data.Cartas : []);
      } catch (e) {
        setCartasDisponibles([]);
      }
    };
    fetchCartas();
  }
}, [agregandoMazo]);

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

  const editarNombreMazo = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay sesión activa');
      const res = await fetch(`http://localhost:8000/mazos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': 'abc123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: nuevoNombre }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.Mensaje || data.Error || 'No se pudo editar el mazo');
      setAlerta({ tipo: 'success', mensaje: '¡Nombre actualizado!' });
      setEditando(false);
      setTimeout(() => {
        setAlerta(null);
        obtenerMazos();
      }, 1200);
    } catch (e: any) {
      setAlerta({ tipo: 'error', mensaje: e.message || 'Error al editar el mazo' });
    }
  };

  // Filtrar cartas
  const cartasFiltradas = cartasDisponibles.filter(carta => {
    const matchAtributo = filtroAtributo ? (carta.atributo || carta.Atributo)?.toLowerCase() === filtroAtributo.toLowerCase() : true;
    const matchNombre = filtroNombre ? (carta.nombre || carta.Nombre)?.toLowerCase().includes(filtroNombre.toLowerCase()) : true;
    return matchAtributo && matchNombre;
  });

  // Guardar nuevo mazo
  const handleGuardarMazo = async () => {
    setErrorForm(null);
    if (!nombreNuevoMazo.trim() || nombreNuevoMazo.length > 20) {
      setErrorForm('El nombre del mazo es obligatorio y debe tener hasta 20 caracteres.');
      return;
    }
    if (cartasSeleccionadas.length === 0) {
      setErrorForm('Debes seleccionar al menos una carta.');
      return;
    }
    if (mazos.length >= 3) {
      setErrorForm('Ya tienes el máximo de 3 mazos creados.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const usuarioData = localStorage.getItem('usuario');
      if (!token || !usuarioData) throw new Error('No hay sesión activa');
      const { id } = JSON.parse(usuarioData);
      const res = await fetch('http://localhost:8000/mazos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': 'abc123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombreNuevoMazo,
          usuario_id: id,
          cartas: cartasSeleccionadas.map(c => c.id || c.ID || c.carta_id)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.Mensaje || data.Error || 'No se pudo crear el mazo');
      setAgregandoMazo(false);
      setNombreNuevoMazo('');
      setCartasSeleccionadas([]);
      setFiltroAtributo('');
      setFiltroNombre('');
      setErrorForm(null);
      setAlerta({ tipo: 'success', mensaje: '¡Mazo creado correctamente!' });
      obtenerMazos();
    } catch (e: any) {
      setErrorForm(e.message || 'Error al crear el mazo');
    }
  };

  return (
    <div className="mazos-page-bg">
      <img src="/assets/images/arcoiris.jpg" alt="Arcoiris" className="mazos-arcoiris-img" />
      <div className="mazos-card">
        {mostrarMazos && !agregandoMazo && (
          <div style={{ position: 'absolute', top: '1.2rem', right: '1.2rem' }}>
            <button
              className="mazos-agregar-btn"
              style={{
                padding: '0.5rem 1.1rem',
                fontSize: '0.95rem',
                borderRadius: '8px',
                background: mazos.length >= 3 ? '#bdbdbd' : '#1bb15f',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                cursor: mazos.length >= 3 ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(59,76,202,0.08)'
              }}
              disabled={mazos.length >= 3}
              onClick={() => {
                if (mazos.length < 3) {
                  setAgregandoMazo(true);
                  setErrorForm(null);
                }
              }}
              title={mazos.length >= 3 ? 'Ya tienes el máximo de 3 mazos creados' : ''}
            >
              Agregar mazo
            </button>
          </div>
        )}
        {mostrarMazos && !agregandoMazo ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '1.2rem' }}>
              <button className="mazos-volver-btn" onClick={() => { setMostrarMazos(false); setMazoSeleccionado(null); setAgregandoMazo(false); }}>
                <span className="flecha">←</span> Volver
              </button>
            </div>
            <h2>Mis Mazos</h2>
            {cargando && <p>Cargando mazos...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            <ul className="mazos-list">
              {mazos.length === 0 && !cargando && !error && (
                <li className="mazos-vacio">Aún no tenés mazos creados.<br/>¡Creá uno nuevo para empezar a jugar!</li>
              )}
              {mazos.map((mazo) => (
                <li key={mazo.id}>
                  <div
                    className={`mazo-nombre${mazoSeleccionado === mazo.id ? ' seleccionado' : ''}`}
                    onClick={() => setMazoSeleccionado(mazo.id)}
                  >
                    {mazo.nombre}
                  </div>
                </li>
              ))}
            </ul>
            {mazos.length > 0 && (
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
                  onClick={() => mazoSeleccionado && navigate(`/jugar/${mazoSeleccionado}`)}
                >
                  Jugar
                </button>
              </div>
            )}
          </>
        ) : agregandoMazo ? (
          <div className="mazos-crear-form">
            <h2>Crear nuevo mazo</h2>
            <input
              type="text"
              maxLength={20}
              placeholder="Nombre del mazo"
              value={nombreNuevoMazo}
              onChange={e => setNombreNuevoMazo(e.target.value)}
              className="mazos-crear-input"
            />
            <div className="mazos-filtros" style={{ width: '100%', maxWidth: 340, display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.1rem' }}>
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={filtroNombre}
                onChange={e => setFiltroNombre(e.target.value)}
                style={{ flex: 2, minWidth: 0, fontSize: '1rem', padding: '0.5rem 0.7rem' }}
              />
              <select
                value={filtroAtributo}
                onChange={e => setFiltroAtributo(e.target.value)}
                style={{ flex: 1.2, minWidth: 0, fontSize: '1rem', padding: '0.5rem 0.7rem' }}
              >
                <option value="">Atributo</option>
                {[...new Set(cartasDisponibles.map(c => c.atributo || c.Atributo))].map((attr, i) => (
                  <option key={i} value={attr}>{attr}</option>
                ))}
              </select>
              <button
                type="button"
                style={{ flex: 1, minWidth: 0, fontSize: '0.95rem', padding: '0.5rem 0.7rem', marginLeft: '0.2rem', whiteSpace: 'nowrap' }}
                onClick={() => { setFiltroAtributo(''); setFiltroNombre(''); }}
              >
                Limpiar
              </button>
            </div>
            <div className="mazos-cartas-listado">
              {cartasFiltradas.map((carta, i) => (
                <label key={i} className="mazos-carta-item">
                  <input
                    type="checkbox"
                    checked={!!cartasSeleccionadas.find(c => (c.id || c.ID || c.carta_id) === (carta.id || carta.ID || carta.carta_id))}
                    onChange={e => {
                      if (e.target.checked) setCartasSeleccionadas([...cartasSeleccionadas, carta]);
                      else setCartasSeleccionadas(cartasSeleccionadas.filter(c => (c.id || c.ID || c.carta_id) !== (carta.id || carta.ID || carta.carta_id)));
                    }}
                  />
                  <span className="mazos-carta-nombre">{carta.nombre || carta.Nombre}</span>
                  <span className="mazos-carta-atributo">{carta.atributo || carta.Atributo}</span>
                  <span className="mazos-carta-ataque">ATK: {carta.ataque || carta.Ataque}</span>
                </label>
              ))}
            </div>
            {errorForm && <div className="mazos-error-form">{errorForm}</div>}
            <div className="mazos-crear-acciones">
              <button className="mazos-accion-btn" onClick={handleGuardarMazo}>Guardar mazo</button>
              <button className="mazos-accion-btn cancelar" onClick={() => { setAgregandoMazo(false); setNombreNuevoMazo(''); setCartasSeleccionadas([]); setErrorForm(null); setMostrarMazos(true); }}>Cancelar</button>
            </div>
          </div>
        ) : (
          <>
            <h1>¡Bienvenido, {nombre}!</h1>
            <p>Aquí podrás ver y gestionar tus mazos de cartas Pokémon.</p>
            <img src="/assets/images/pikachu2.jpg" alt="Pokémon" className="mazos-img" />
            <button className="mazos-btn" onClick={() => { setMostrarMazos(true); setAgregandoMazo(false); obtenerMazos(); }}>
              Ver mazos
            </button>
          </>
        )}

        {/* Modal para ver mazo */}
        {modalAbierto && mazoActivo && (
          <div className="mazos-modal-bg">
            <div className="mazos-modal">
              <h3>
                {editando ? (
                  <form className="mazos-editar-form" onSubmit={e => { e.preventDefault(); editarNombreMazo(mazoActivo.id); }}>
                    <input
                      type="text"
                      value={nuevoNombre}
                      onChange={e => setNuevoNombre(e.target.value)}
                      className="mazos-editar-input"
                      maxLength={30}
                      required
                    />
                    <button type="submit" className="mazos-accion-btn">Guardar</button>
                    <button type="button" className="mazos-accion-btn cancelar" onClick={() => { setEditando(false); setNuevoNombre(mazoActivo.nombre); }}>Cancelar</button>
                  </form>
                ) : (
                  <span>{mazoActivo.nombre}</span>
                )}
              </h3>
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
                    <button className="mazos-accion-btn" onClick={() => { setEditando(true); setNuevoNombre(mazoActivo.nombre); }}>Editar mazo</button>
                    <button className="mazos-accion-btn" onClick={() => setConfirmarEliminar(true)}>Eliminar mazo</button>
                    <button className="mazos-accion-btn" onClick={() => { setModalAbierto(false); setAlerta(null); setConfirmarEliminar(false); setEditando(false); }}>Cerrar</button>
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