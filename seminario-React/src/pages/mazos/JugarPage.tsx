import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../../assets/styles/JugarPage.css";

const JugarPage: React.FC = () => {
  const { mazoId } = useParams();
  const navigate = useNavigate();
  const [cartasUsuario, setCartasUsuario] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partidaId, setPartidaId] = useState<number | null>(null);
  const [jugada, setJugada] = useState<any | null>(null);
  const [finalizada, setFinalizada] = useState(false);
  const [mostrarModalFinal, setMostrarModalFinal] = useState(false);
  const [resultadoFinal, setResultadoFinal] = useState<string | null>(null);
  const [cartasEnCentro, setCartasEnCentro] = useState<{usuario?: any, servidor?: any} | null>(null);
  const [resultadoRonda, setResultadoRonda] = useState<string | null>(null);
  const [animando, setAnimando] = useState(false);
  const [cartasServidor, setCartasServidor] = useState<any[]>([]);

  // Simulación de cartas del oponente (atributos)
  const cartasOponente = [
    { atributo: 'Eléctrico' },
    { atributo: 'Fuego' },
    { atributo: 'Agua' },
    { atributo: 'Planta' },
    { atributo: 'Psíquico' }
  ];

  // Función para iniciar/reiniciar partida
  const iniciarPartidaYObtenerCartas = async () => {
    if (!mazoId) return;
    setCargando(true);
    setError(null);
    setFinalizada(false);
    setJugada(null);
    setResultadoFinal(null);
    setCartasUsuario([]);
    setCartasEnCentro(null);
    setResultadoRonda(null);
    try {
      const usuarioData = localStorage.getItem('usuario');
      const token = localStorage.getItem('token');
      if (!usuarioData || !token) throw new Error('No hay sesión activa');
      const { id } = JSON.parse(usuarioData);
      // Iniciar partida
      const resPartida = await fetch('http://localhost:8000/partidas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': 'abc123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mazo: Number(mazoId) })
      });
      const dataPartida = await resPartida.json();
      if (!resPartida.ok) throw new Error(dataPartida.Mensaje || 'No se pudo iniciar la partida');
      setPartidaId(dataPartida.partida_id);
      // Obtener cartas en mano de la partida
      const resCartas = await fetch(`http://localhost:8000/usuarios/${id}/partidas/${dataPartida.partida_id}/cartas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': 'abc123',
        },
      });
      const dataCartas = await resCartas.json();
      if (!resCartas.ok) throw new Error(dataCartas.Mensaje || 'No se pudieron obtener las cartas de la partida');
      setCartasUsuario(Array.isArray(dataCartas) ? dataCartas : []);
      // Obtener cartas del mazo 1 (servidor)
      const resCartasServidor = await fetch(`http://localhost:8000/mazos/1/cartas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': 'abc123',
        },
      });
      const dataCartasServidor = await resCartasServidor.json();
      setCartasServidor(Array.isArray(dataCartasServidor) ? dataCartasServidor : (dataCartasServidor.Cartas || []));
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    iniciarPartidaYObtenerCartas();
    // eslint-disable-next-line
  }, [mazoId]);

  const handleJugarCarta = async (carta: any) => {
    if (!partidaId || finalizada || animando) return;
    setCargando(true);
    setError(null);
    setAnimando(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay sesión activa');
      // El id de la carta puede venir como 'ID carta' o 'carta_id'
      const cartaId = carta['ID carta'] || carta['carta_id'] || carta.id;
      const res = await fetch('http://localhost:8000/jugadas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': 'abc123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partida_id: partidaId, carta_id: cartaId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.Mensaje || 'No se pudo realizar la jugada');
      setJugada(data);
      // Buscar la carta del servidor en cartasServidor
      const cartaServidorId = data['Carta del servidor'];
      const cartaServidor = cartasServidor.find(c => (c.id || c['ID carta'] || c.carta_id) === cartaServidorId) || { id: cartaServidorId, fuerza: data['Fuerza del servidor'] };
      // Mostrar cartas jugadas en el centro
      setCartasEnCentro({
        usuario: carta,
        servidor: {
          ...cartaServidor,
          fuerza: data['Fuerza del servidor']
        }
      });
      setResultadoRonda(data['Ganador']);
      // Actualizar cartas en mano
      const usuarioData = localStorage.getItem('usuario');
      const { id } = usuarioData ? JSON.parse(usuarioData) : {};
      const resCartas = await fetch(`http://localhost:8000/usuarios/${id}/partidas/${partidaId}/cartas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-api-key': 'abc123',
        },
      });
      const dataCartas = await resCartas.json();
      setCartasUsuario(Array.isArray(dataCartas) ? dataCartas : []);
      // Si la jugada indica que la partida terminó, mostrar modal final
      if (data.Mensaje && data.Mensaje.includes('finalizada')) {
        setFinalizada(true);
        setResultadoFinal(data.Resultado || '');
        setTimeout(() => {
          setCartasEnCentro(null);
          setResultadoRonda(null);
          setMostrarModalFinal(true);
          setAnimando(false);
        }, 1800);
      } else {
        // Si no, ocultar las cartas del centro y el badge después de un tiempo
        setTimeout(() => {
          setCartasEnCentro(null);
          setResultadoRonda(null);
          setAnimando(false);
        }, 1500);
      }
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
      setAnimando(false);
    } finally {
      setCargando(false);
    }
  };

  const handleJugarOtraVez = () => {
    setMostrarModalFinal(false);
    iniciarPartidaYObtenerCartas();
  };

  return (
    <div className="jugar-container">
      <h2 className="jugar-titulo"></h2>
      <div className="tablero">
        <div className="cartas-oponente">
          <h3>Cartas del oponente</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {cartasOponente.map((carta, index) => (
              <div key={index} className="carta">
                <div className="carta-atributo">{carta.atributo}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="zona-juego">
          {/* Cartas jugadas en el centro */}
          {cartasEnCentro && (
            <div className="cartas-centro-wrapper">
              <div className="carta-centro carta-centro-usuario slide-up">
                <div className="carta-contenido">
                  <div className="carta-nombre">{cartasEnCentro.usuario['Nombre del pokemon'] || cartasEnCentro.usuario.nombre}</div>
                  <div className="carta-atributo">{cartasEnCentro.usuario.atributo || cartasEnCentro.usuario['atributo'] || cartasEnCentro.usuario['Nombre del ataque'] || cartasEnCentro.usuario['ataque_nombre']}</div>
                  <div className="carta-ataque">ATK: {cartasEnCentro.usuario.ataque || cartasEnCentro.usuario['ataque'] || cartasEnCentro.usuario['Fuerza'] || cartasEnCentro.usuario['Ataque'] || ''}</div>
                </div>
              </div>
              <div className="carta-centro carta-centro-servidor slide-down">
                <div className="carta-contenido">
                  <div className="carta-nombre">{cartasEnCentro.servidor['Nombre del pokemon'] || cartasEnCentro.servidor.nombre || cartasEnCentro.servidor['Nombre'] || 'Servidor'}</div>
                  <div className="carta-atributo">{cartasEnCentro.servidor.atributo || cartasEnCentro.servidor['atributo'] || cartasEnCentro.servidor['Atributo'] || cartasEnCentro.servidor['Nombre del ataque'] || cartasEnCentro.servidor['ataque_nombre'] || '?'}</div>
                  <div className="carta-ataque">ATK: {cartasEnCentro.servidor.fuerza || cartasEnCentro.servidor['Fuerza'] || cartasEnCentro.servidor['Ataque'] || cartasEnCentro.servidor['ataque'] || cartasEnCentro.servidor.ataque || ''}</div>
                </div>
              </div>
              {resultadoRonda && (
                <div className={`badge-resultado ${resultadoRonda.toLowerCase()}`}>{resultadoRonda === 'Usuario' ? '¡Ganaste!' : resultadoRonda === 'Servidor' ? 'Perdiste' : 'Empate'}</div>
              )}
            </div>
          )}
          {/* Modal de resultado final de partida */}
          {mostrarModalFinal && (
            <div className="modal-jugada-bg">
              <div className="modal-jugada" onClick={e => e.stopPropagation()}>
                <h3>¡Partida finalizada!</h3>
                {jugada && (
                  <>
                    <div><b>Resultado última ronda:</b> {jugada['Ganador']}</div>
                    <div><b>Tu carta:</b> {jugada['Carta del usuario']}</div>
                    <div><b>Carta servidor:</b> {jugada['Carta del servidor']}</div>
                  </>
                )}
                <div style={{marginTop: '1.2rem', fontSize: '1.2rem', color: '#1d3557'}}><b>Resultado de la partida:</b> {resultadoFinal}</div>
                <button className="modal-jugada-btn" onClick={handleJugarOtraVez}>Jugar otra vez</button>
                <button className="modal-jugada-btn" style={{background:'#e63946',marginLeft:'1rem'}} onClick={()=>navigate('/mis-mazos')}>Volver a Mis Mazos</button>
              </div>
            </div>
          )}
        </div>
        <div className="cartas-usuario">
          <h3>Tus cartas</h3>
          {cargando && <p>Cargando cartas...</p>}
          {error && <p style={{color: 'red'}}>{error}</p>}
          <div style={{ display: 'flex', gap: '10px' }}>
            {Array.isArray(cartasUsuario) && cartasUsuario.map((carta, index) => {
              console.log('Carta usuario:', carta);
              return (
                <div key={index} className="carta" onClick={() => handleJugarCarta(carta)} style={{opacity: finalizada || animando ? 0.5 : 1, pointerEvents: finalizada || animando ? 'none' : 'auto'}}>
                  <div className="carta-contenido">
                    <div className="carta-nombre">{carta['Nombre del pokemon'] || carta.nombre}</div>
                    <div className="carta-atributo">{carta.atributo || carta['atributo'] || carta['Nombre del ataque'] || carta['ataque_nombre']}</div>
                    <div className="carta-ataque">ATK: {carta.ataque || carta['ataque'] || carta['Fuerza'] || carta['Ataque'] || ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="resultado-partida">
        {/* Aquí se mostrará el resultado de la partida */}
      </div>
    </div>
  );
};

export default JugarPage; 