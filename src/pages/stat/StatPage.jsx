import React, { useEffect, useState } from 'react';
import { buildApiUrl, getAuthHeaders } from '../../config/api';
import '../../assets/styles/StatPage.css';

const StatPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [orden, setOrden] = useState('mejor'); // 'mejor' o 'peor'
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setCargando(true);
      setError(null);
      try {
        const res = await fetch('/estadisticas', {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('No se pudieron obtener las estadísticas');
        const data = await res.json();
        setUsuarios(Array.isArray(data) ? data : (data.usuarios || []));
      } catch (e) {
        setError(e.message || 'Error desconocido');
      } finally {
        setCargando(false);
      }
    };
    fetchStats();
  }, []);

  // Calcular promedio y ordenar
  const usuariosConPromedio = usuarios.map(u => {
    const jugadas = Number(u['Partidas jugadas']) || 0;
    const ganadas = Number(u['Victorias']) || 0;
    const perdidas = Number(u['Derrotas']) || 0;
    const empatadas = Number(u['Empates']) || 0;
    return {
      ...u,
      jugadas,
      ganadas,
      perdidas,
      empatadas,
      promedio: jugadas > 0 ? ganadas / jugadas : 0
    };
  });
  const usuariosOrdenados = [...usuariosConPromedio].sort((a, b) => {
    if (orden === 'mejor') return b.promedio - a.promedio;
    return a.promedio - b.promedio;
  });

  const mejorPromedio = usuariosOrdenados[0]?.promedio;

  return (
    <div className="stat-container">
      <h1>Estadísticas de Pokebattle</h1>
      <div className="stat-orden">
        <button
          className={orden === 'mejor' ? 'activo' : ''}
          onClick={() => setOrden('mejor')}
        >Mejor performance</button>
        <button
          className={orden === 'peor' ? 'activo' : ''}
          onClick={() => setOrden('peor')}
        >Peor performance</button>
      </div>
      {cargando && <p>Cargando estadísticas...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!cargando && !error && usuariosOrdenados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <h3>No hay estadísticas disponibles</h3>
          <p>¡Sé el primero en jugar y aparecerás aquí!</p>
        </div>
      )}
      {!cargando && !error && usuariosOrdenados.length > 0 && (
        <table className="stat-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Partidas</th>
            <th>Ganadas</th>
            <th>Perdidas</th>
            <th>Empatadas</th>
            <th>Promedio ganadas</th>
          </tr>
        </thead>
        <tbody>
          {usuariosOrdenados.map((u, i) => (
            <tr key={u.Nombre}
                className={u.promedio === mejorPromedio && orden === 'mejor' && i === 0 ? 'mejor' : ''}>
              <td>{u.Nombre}</td>
              <td>{u.jugadas}</td>
              <td>{u.ganadas}</td>
              <td>{u.perdidas}</td>
              <td>{u.empatadas}</td>
              <td>{(u.promedio * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
        </table>
      )}
    </div>
  );
};

export default StatPage;
